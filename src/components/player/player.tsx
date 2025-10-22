import {
  Component,
  Element,
  h,
  EventEmitter,
  Event,
  Listen,
  Method,
  State,
  Prop,
  Watch,
} from '@stencil/core';

import { Mode, Status, defaultStatus } from '../../utils/status';
import { TextTrackList, WebVTT } from '../../utils/webVTT';
import { bind } from '../../utils/bind';
import { isKnownLocale } from '../../utils/locales';
import { ToggleControlProps, CueListChangeEventProps } from '../../utils/types';
import {
  exitFullscreen,
  fixDecimalPrecision,
  getPresentationNodes,
  getVideoElement,
  hasDefaultScrollingBehavior,
  isInteractiveElement,
  isSmall,
  requestFullscreen,
} from '../../utils/helpers';
import {
  HTMLXmVideoElement,
  Presentations,
  XmVideoFunctions,
} from '../../types/common';
import { Loading } from './elements';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true,
})
export class Player {
  /**
   * Used on key control to skip the video forwards and backwards
   */
  private skippedSeconds = 5;

  /**
   * List of keyboard keys the player listens to on the 'keydown` event
   */
  private shortcutKeys = {
    Space: ' ',
    Enter: 'Enter',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    f: 'f',
    m: 'm',
  };

  @Element()
  private el: HTMLXmPlayerElement;

  @Prop({ mutable: true }) volume: number = defaultStatus.volume;

  @Prop({ mutable: true }) playbackrate: number =
    defaultStatus.settings.playbackRate;

  @Prop({ mutable: true }) showsubtitle: boolean =
    defaultStatus.subtitle.enabled;

  @Prop({ attribute: 'lang' }) lang: string;

  @Prop() slidesSrc?: string;

  @State()
  status: Status = defaultStatus;

  @State()
  private toggleControlButtons: Array<ToggleControlProps>;

  @State() activePresentationMode: string;

  private primary: HTMLXmVideoElement;

  private secondary: HTMLXmVideoElement | null;

  private textTracks: TextTrackList = new TextTrackList();

  private hasDefaultTexttrack: boolean = false;

  private primaryRatio: number;

  private secondaryRatio: number;

  private presentations: Presentations = {};

  /**
   *  Emits list of cues of currently selected language.
   */
  @Event({ eventName: 'notifyCueListChanged' })
  cueListChangeEvent: EventEmitter<CueListChangeEventProps>;

  /**
   * Emits list of currently active/visible cues by language and second
   * to notifies external listeners that the active cues have changed
   */
  @Event({ eventName: 'notifyActiveCuesUpdated' })
  activeCueUpdateEvent: EventEmitter<CueListChangeEventProps>;

  componentWillLoad() {
    const presentationNodes = getPresentationNodes(this.el);

    presentationNodes.forEach((presentation) => {
      const references = presentation.reference.split(',');
      const content = { refs: references, label: presentation.label };
      Object.defineProperty(this.presentations, presentation.name, {
        value: content,
      });
    });

    this.activePresentationMode = Object.getOwnPropertyNames(
      this.presentations,
    )[0];
  }

  componentDidLoad() {
    this.primary = getVideoElement(this.el, '[slot=primary]')!;
    this.secondary = getVideoElement(this.el, '[slot=secondary]');

    this.primary.addEventListener('click', this._click);
    this.primary.addEventListener('timeupdate', this.timeUpdate);
    this.primary.addEventListener('ended', this._ended);

    if (this.secondary) {
      this.secondary.addEventListener('click', this._click);
      this.secondary.volume = 0;
    }

    document.addEventListener('fullscreenchange', this._fullscreenchange);
    document.addEventListener('webkitfullscreenchange', this._fullscreenchange);

    // On small devices the volume slider is hidden
    // So the user can only change it via the device buttons
    // That's why the player's initial state for 'volume' will remain the default 100%
    if (!isSmall) {
      this._setVolume(this.volume);
    }
    this._setPlaybackRate(this.playbackrate);
    this.setLanguage(this.lang);
    this.status = { ...this.status, loading: false };
  }

  disconnectedCallback() {
    this.primary.removeEventListener('click', this._click);
    this.primary.removeEventListener('timeupdate', this.timeUpdate);
    this.primary.removeEventListener('ended', this._ended);
    if (this.secondary)
      this.secondary.removeEventListener('click', this._click);

    document.removeEventListener('fullscreenchange', this._fullscreenchange);
    document.removeEventListener(
      'webkitfullscreenchange',
      this._fullscreenchange,
    );
  }

  render() {
    return (
      <div class="player" tabindex="0">
        {<Loading status={this.status}></Loading>}
        {this.renderVideoContent()}
        {this.renderControls()}
      </div>
    );
  }

  /**
   * Call a method on all videos.
   *
   * Use this when you want to call on all videos being rendered, without having to check how many there are.
   * @param functionName
   * @param params
   */
  @bind()
  private async _invokePlayerFunction(
    functionName: keyof XmVideoFunctions,
    params?: any,
  ) {
    if (!this.primary[functionName]) return;
    return Promise.all([
      this.primary[functionName].apply<HTMLXmVideoElement, any, Promise<any>>(
        this.primary,
        params,
      ),
      this.secondary
        ? this.secondary[functionName].apply<
            HTMLXmVideoElement,
            any,
            Promise<any>
          >(this.secondary, params)
        : null,
    ]);
  }

  @bind()
  protected async _click() {
    if (!this.status.openedSettingsMenu && !this.status.showPlaybackRate) {
      switch (this.status.mode) {
        case Mode.PAUSED:
        case Mode.FINISHED:
          return this.play();
        default:
          return this.pause();
      }
    }
  }

  private timeUpdate = async (e: Event) => {
    const { seconds, duration } = (e as CustomEvent).detail;
    this.cueUpdate(seconds);
    this.status = {
      ...this.status,
      duration,
      progress: seconds,
    };
    if (this.secondary) {
      const currentTime = await this.secondary.currentTime();
      const skew = Math.abs(currentTime - seconds);
      if (skew > 1.0) {
        this.secondary.seek(seconds);
      }
    }
  };

  private cueUpdate = (seconds: number, refresh?: boolean) => {
    const { activeCues } = this.status.subtitle;
    const cues = this.textTracks.getActiveCues(seconds);
    if (
      cues &&
      (refresh || !this.textTracks.compareCueLists(cues, activeCues))
    ) {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          activeCues: cues,
        },
      };
      this.activeCueUpdateEvent.emit({ cues });
    }
  };

  @Listen('buffering')
  handleBufferStart() {
    this.status = { ...this.status, loading: true };
  }

  @Listen('buffered')
  handleBufferEnd() {
    this.status = { ...this.status, loading: false };
  }

  @Listen('ratioLoaded')
  _resizeScreen(e: CustomEvent) {
    if (e.detail.name === 'primary') {
      this.primaryRatio = parseFloat(e.detail.ratio) * 100;
    } else {
      this.secondaryRatio = parseFloat(e.detail.ratio) * 100;
    }
  }

  @bind()
  @Listen('toggleControl:loaded')
  protected _addToggleControlButton(e: CustomEvent<ToggleControlProps>) {
    if (!e.detail) return;
    if (!this.toggleControlButtons)
      this.toggleControlButtons = new Array<ToggleControlProps>();
    this.toggleControlButtons.push(e.detail);
  }

  @bind()
  @Listen('control:changeToggleControlActiveState')
  protected _changeToggleControlActiveState(
    e: CustomEvent<ToggleControlProps>,
  ) {
    const newToggleControlProps: ToggleControlProps = e.detail;

    this.toggleControlButtons = this.toggleControlButtons.map(
      (toggleControl) => {
        // apply changed props to player state, leave rest unchanged
        if (toggleControl.name === newToggleControlProps.name)
          return newToggleControlProps;
        return toggleControl;
      },
    );
  }

  @bind()
  @Listen('texttrack:loaded')
  protected _addTextTrack(e: CustomEvent) {
    const vtt: WebVTT = e.detail.webVTT;
    const { total, isDefault } = e.detail;
    if (!vtt) {
      this.textTracks.increaseLoadedFiles();
      return;
    }
    this.textTracks.addWebVTT(vtt, total);
    if (!this.hasDefaultTexttrack) {
      this.setLanguage(this.lang);
      // Use the default text track
      if (isDefault) {
        this.hasDefaultTexttrack = true;
        this._setTextTrack(vtt.meta.language, this.showsubtitle);
        // Use the player language as default text track language
      } else if (vtt.meta.language === this.status.language) {
        this._setTextTrack(vtt.meta.language, this.showsubtitle);
      }
    }
  }

  @bind()
  @Listen('keydown')
  private handleKeyDown(e: KeyboardEvent) {
    const { key, altKey, shiftKey, ctrlKey, metaKey } = e;
    const target = e.target as Element;

    // Only trigger internal functions when pressed without special key
    if (altKey || ctrlKey || metaKey || shiftKey) {
      return;
    }

    if (hasDefaultScrollingBehavior(key, target)) {
      // Prevent default scrolling when focusing the player and pressing "Space" or "ArrowUp" / "ArrowDown"
      e.preventDefault();
    }

    switch (key) {
      case this.shortcutKeys.Space:
      case this.shortcutKeys.Enter:
        // Some interactive elements, e.g. links and buttons, have default behavior for Space and Enter keys.
        // The events still bubble up in this case, but we want to ignore them, when the user was focusing on such an element
        if (isInteractiveElement(target)) return;
        this.togglePlay();
        break;
      case this.shortcutKeys.ArrowUp:
        this.increaseVolume();
        break;
      case this.shortcutKeys.ArrowDown:
        this.decreaseVolume();
        break;
      case this.shortcutKeys.ArrowLeft:
        this.skipBackward();
        break;
      case this.shortcutKeys.ArrowRight:
        this.skipForward();
        break;
      case this.shortcutKeys.f:
        this.toggleFullscreen();
        break;
      case this.shortcutKeys.m:
        this.toggleMute();
        break;
    }
  }

  /**
   * Invoke the play function on the player.
   * Also sets the internal state to mode "playing"
   */
  @Method()
  @Listen('control:play')
  public async play() {
    await this._invokePlayerFunction('play');
    this.status = { ...this.status, mode: Mode.PLAYING };
  }

  /**
   * Invoke the pause function on the player.
   * Also sets the internal state to mode "paused"
   */
  @Method()
  @Listen('control:pause')
  public async pause() {
    await this._invokePlayerFunction('pause');
    this.status = { ...this.status, mode: Mode.PAUSED };
  }

  /**
   * Invoke the seek function on the player.
   *
   * Sometimes seeking starts playing the video.
   * If the player was in paused state, we manually pause again.
   *
   * @param seconds
   */
  @Method()
  public async seek(seconds: number) {
    await this._invokePlayerFunction('seek', [seconds]);

    if (this.status.mode === Mode.PAUSED) {
      this.pause();
      this.status = {
        ...this.status,
        progress: seconds,
      };
      this.cueUpdate(seconds);
    }
  }

  /**
   * Get the current video progress
   *
   */
  @Method()
  async getProgress(): Promise<number> {
    return this.status.progress;
  }

  @bind()
  protected async _ended() {
    this.status = { ...this.status, mode: Mode.FINISHED };
  }

  @bind()
  protected _fullscreenchange() {
    const doc = document as any;
    const fullscreen =
      doc.fullScreen || doc.mozFullScreen || doc.webkitIsFullScreen;
    this.status = { ...this.status, fullscreen };
  }

  @Listen('slider:seek')
  protected async _seek(e: CustomEvent) {
    await this.seek(e.detail.seconds);
  }

  @Listen('control:enterFullscreen')
  private enterFullscreen() {
    if (!this.status.fullscreen) {
      requestFullscreen(this.el, this.primary);
    }
  }

  @Listen('control:exitFullscreen')
  private exitFullscreen() {
    if (this.status.fullscreen) {
      exitFullscreen(this.primary);
    }
  }

  @Listen('control:openSettingsMenu')
  protected async _openSettingsMenu() {
    this.status = { ...this.status, openedSettingsMenu: true };
  }

  @Listen('control:closeSettingsMenu')
  protected async _closeSettingsMenu() {
    this.status = { ...this.status, openedSettingsMenu: false };
  }

  /**
   * Sets the mute state true and the primary slot volume to 0.
   */
  @Method()
  @Listen('control:mute')
  public async mute() {
    this.primary.volume = 0;
    this.status = { ...this.status, muted: true };
  }

  /**
   * Sets the mute state false and resets the primary slot video volume.
   */
  @Method()
  @Listen('control:unmute')
  public async unmute() {
    this.primary.volume = this.status.volume;
    this.status = { ...this.status, muted: false };
  }

  @bind()
  public async _setVolume(volume: number) {
    this.status = {
      ...this.status,
      volume,
    };

    if (volume === 0) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  @Listen('control:changeVolume')
  public async _changeVolume(e: CustomEvent) {
    this._setVolume(e.detail.volume);
  }

  /**
   * Values of the keyboard keys the player listens to on the 'keydown` event.
   *
   * Internal functions are only triggered when key is pressed without special key
   * (alt, ctrl, meta, shift).
   */
  @Method()
  async getShortcutKeys(): Promise<Array<string>> {
    return Promise.resolve(Object.values(this.shortcutKeys));
  }

  @Watch('volume')
  _setupVolume(newValue: string, oldValue: string) {
    const volume = parseFloat(newValue);
    if (newValue != oldValue) {
      this._setVolume(volume);
    }
  }

  private setLanguage = (language: string) => {
    const candidates: Array<string> = [
      language,
      navigator && navigator.language,
    ];

    const closestLang = this.el
      .closest('[lang]')
      ?.getAttribute('lang')
      ?.slice(0, 2);

    if (closestLang) {
      candidates.push(closestLang);
    }

    const chosen = candidates.find(isKnownLocale);

    this.status = {
      ...this.status,
      language: chosen || defaultStatus.language,
    };
  };

  @Watch('lang')
  _setupLanguage(newValue: string, oldValue: string) {
    if (newValue != oldValue) {
      this.setLanguage(newValue);
    }
  }

  @bind()
  public async _setPlaybackRate(playbackRate: number) {
    if (!isNaN(playbackRate)) {
      await this._invokePlayerFunction('setPlaybackRate', [playbackRate]);
      this.status = {
        ...this.status,
        settings: {
          ...this.status.settings,
          playbackRate,
        },
      };
    }
  }

  @Listen('setting:changePlaybackRate')
  @Listen('control:changePlaybackRate')
  protected async _changePlaybackRate(e: CustomEvent) {
    this._setPlaybackRate(e.detail.playbackRate);
  }

  @Watch('playbackrate')
  _setupPlaybackRate(newValue: string, oldValue: string) {
    if (newValue === oldValue) return;

    const playbackRate = parseFloat(newValue);
    this._setPlaybackRate(playbackRate);
  }

  @Listen('control:showPlaybackRate')
  protected async _showPlaybackRate() {
    this.status = { ...this.status, showPlaybackRate: true };
  }

  @Listen('control:hidePlaybackRate')
  protected async _hidePlaybackRate() {
    this.status = { ...this.status, showPlaybackRate: false };
  }

  /**
   * Enable the text track
   */
  @Method()
  @Listen('control:enableTextTrack')
  public async enableTextTrack() {
    this.status = {
      ...this.status,
      subtitle: {
        ...this.status.subtitle,
        enabled: true,
      },
      settings: {
        ...this.status.settings,
        textTrack: this.status.subtitle.language,
      },
    };
  }

  /**
   * Disable the text track
   */
  @Method()
  @Listen('control:disableTextTrack')
  public async disableTextTrack() {
    this.status = {
      ...this.status,
      subtitle: {
        ...this.status.subtitle,
        enabled: false,
      },
      settings: {
        ...this.status.settings,
        textTrack: defaultStatus.settings.textTrack,
      },
    };
  }

  @bind()
  public _setTextTrack(textTrack: string, enable: boolean = true) {
    if (textTrack === defaultStatus.settings.textTrack) {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          enabled: false,
        },
      };
    } else {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          language: textTrack,
          enabled: enable,
        },
      };
      // Sets the current language & cues in the used player TextTrackList
      this.textTracks.setCurrentCuesByLanguage(textTrack);
      // Notifies external listeners that a full cue list change has occurred
      const currentCues = this.textTracks.getCurrentCues();
      this.cueListChangeEvent.emit({
        cues: currentCues,
      });
      // Triggers an update for collecting active cues for the new language
      this.cueUpdate(this.status.progress, true);
    }
    this.status = {
      ...this.status,
      settings: {
        ...this.status.settings,
        textTrack,
      },
    };
  }

  @Listen('setting:changeTextTrack')
  public _changeTextTrack(e: CustomEvent) {
    this._setTextTrack(e.detail.textTrack);
  }

  @bind()
  private togglePlay() {
    if (this.status.mode === Mode.PAUSED) {
      this.play();
    }
    if (this.status.mode === Mode.PLAYING) {
      this.pause();
    }
  }

  @bind()
  private toggleFullscreen() {
    if (this.status.fullscreen) {
      exitFullscreen(this.primary);
    } else {
      requestFullscreen(this.el, this.primary);
    }
  }

  @bind()
  private toggleMute() {
    if (this.status.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  @bind()
  private increaseVolume() {
    let volume = fixDecimalPrecision(this.status.volume);

    if (volume < 1) {
      this._setVolume((volume += 0.1));
    }
  }

  @bind()
  private decreaseVolume() {
    let volume = fixDecimalPrecision(this.status.volume);

    if (volume > 0) {
      this._setVolume((volume -= 0.1));
    }
  }

  @bind()
  private skipForward() {
    const progress = this.status.progress;
    const endOfVideo = this.status.duration;
    const newPosition =
      progress < endOfVideo - this.skippedSeconds
        ? progress + this.skippedSeconds
        : endOfVideo;

    this.seek(newPosition);
  }

  @bind()
  private skipBackward() {
    const progress = this.status.progress;
    const newPosition =
      progress < this.skippedSeconds ? 0 : progress - this.skippedSeconds;

    this.seek(newPosition);
  }

  /**
   *  Depending on the currently active presentation,
   *  this will determine which video sources to render
   *
   *  Both slot and name attributes are needed to
   *  pass through slots from consumers to subcomponents to cross the Shadow-DOM boundary
   *
   */
  private renderVideoContent = () => {
    const activePresentation = this.presentations[this.activePresentationMode];
    const refs = activePresentation.refs;

    if (refs.length === 2) {
      this.renderVideoByRef(refs[0], 'primary');
      this.renderVideoByRef(refs[1], 'secondary');

      return (
        <xm-screen
          fullscreen={this.status.fullscreen}
          primaryRatio={this.primaryRatio}
          secondaryRatio={this.secondaryRatio}
        >
          <slot slot="primary" name="primary"></slot>
          <slot slot="secondary" name="secondary"></slot>
        </xm-screen>
      );
    } else {
      this.renderVideoByRef(refs[0], 'primary');

      return <slot slot="primary" name="primary"></slot>;
    }
  };

  private renderVideoByRef = (ref: string, slot: string) => {
    const video = this.el.querySelector(
      `[name='${ref}']`,
    ) as HTMLXmVideoElement;
    video.setAttribute('slot', slot);
    video.setAttribute('active', 'true');
    video.ondblclick = this.toggleFullscreen;
  };

  private renderControls = () => {
    return (
      <xm-controls
        status={this.status}
        textTracks={this.textTracks}
        toggleControlButtons={this.toggleControlButtons}
        slidesSrc={this.slidesSrc}
      >
        {this.toggleControlButtons &&
          this.toggleControlButtons.map((button) => (
            // Pass through slots from consumers to subcomponents to cross the Shadow-DOM boundary
            <slot slot={button.name} name={button.name}></slot>
          ))}
      </xm-controls>
    );
  };
}
