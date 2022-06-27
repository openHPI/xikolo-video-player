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
import {
  ToggleControlProps,
  CueListChangeEventProps,
  VimeoSeekedDetail,
} from '../../utils/types';
import {
  fixDecimalPrecision,
  hasDefaultScrollingBehavior,
  isInteractiveElement,
  isSmall,
} from '../../utils/helpers';
import { HTMLXmVideoElement, XmVideoFunctions } from '../../types/common';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true,
})
export class Player {
  /**
   * Used on key control to skip the video forwards and backwards
   */
  skippedSeconds = 5;

  /**
   * List of keyboard keys the player listens to on the 'keydown` event
   */
  shortcutKeys = {
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

  private primary: HTMLXmVideoElement | undefined;

  private secondary: HTMLXmVideoElement | undefined;

  private textTracks: TextTrackList = new TextTrackList();

  private hasSecondarySlot: boolean;

  private hasDefaultTexttrack: boolean = false;

  private primaryRatio: number;

  private secondaryRatio: number;

  // Emits list of cues of currently selected language.
  @Event({ eventName: 'notifyCueListChanged' })
  cueListChangeEvent: EventEmitter<CueListChangeEventProps>;

  // Emits list of currently active/visible cues by language and second.
  @Event({ eventName: 'notifyActiveCuesUpdated' })
  activeCueUpdateEvent: EventEmitter<CueListChangeEventProps>;

  public render() {
    return (
      <div class="player" tabindex="0">
        {this.hasSecondarySlot ? (
          // Pass through slots from consumers to subcomponents to cross the Shadow-DOM boundary
          <xm-screen
            fullscreen={this.status.fullscreen}
            primaryRatio={this.primaryRatio}
            secondaryRatio={this.secondaryRatio}
          >
            <slot slot="primary" name="primary"></slot>
            <slot slot="secondary" name="secondary"></slot>
          </xm-screen>
        ) : (
          <slot slot="primary" name="primary"></slot>
        )}
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
      </div>
    );
  }

  componentWillLoad() {
    this.hasSecondarySlot = !!this.el.querySelector('[slot="secondary"]');
  }

  public componentDidLoad() {
    this.primary = this.el.querySelector(
      '[slot=primary]'
    ) as HTMLXmVideoElement;
    this.secondary = this.el.querySelector(
      '[slot=secondary]'
    ) as HTMLXmVideoElement;

    this.primary.addEventListener('click', this._click);
    this.primary.addEventListener('timeupdate', this._timeUpdate);
    this.primary.addEventListener('ended', this._ended);
    if (this.secondary) {
      this.secondary.addEventListener('click', this._click);
      this.secondary.volume = 0;
    }

    document.addEventListener('fullscreenchange', this._fullscreenchange);
    document.addEventListener('MSFullscreenChange', this._fullscreenchange);
    document.addEventListener('webkitfullscreenchange', this._fullscreenchange);

    document.addEventListener('click', this._hideSettingsMenuOnClickOutside);

    // On small devices the volume slider is hidden
    // So the user can only change it via the device buttons
    // That's why the player's initial state for 'volume' will remain the default 100%
    if (!isSmall) {
      this._setVolume(this.volume);
    }
    this._setPlaybackRate(this.playbackrate);
    this._setLanguage(this.lang);
  }

  public disconnectedCallback() {
    this.primary.removeEventListener('click', this._click);
    this.primary.removeEventListener('timeupdate', this._timeUpdate);
    this.primary.removeEventListener('ended', this._ended);
    if (this.secondary)
      this.secondary.removeEventListener('click', this._click);

    document.removeEventListener('fullscreenchange', this._fullscreenchange);
    document.removeEventListener('MSFullscreenChange', this._fullscreenchange);
    document.removeEventListener(
      'webkitfullscreenchange',
      this._fullscreenchange
    );

    document.removeEventListener('click', this._hideSettingsMenuOnClickOutside);
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
    params?: any
  ) {
    if (!this.primary[functionName]) return;
    return Promise.all([
      this.primary[functionName].apply<HTMLXmVideoElement, any, Promise<any>>(
        this.primary,
        params
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

  @bind()
  protected async _hideSettingsMenuOnClickOutside() {
    if (this.status.openedSettingsMenu || this.status.showPlaybackRate) {
      this._closeSettingsMenu();
      this._hidePlaybackRate();
    }
  }

  @bind()
  protected async _timeUpdate(e: Event) {
    const { seconds, percent, duration } = (e as CustomEvent).detail;
    this._cueUpdate(seconds);
    this.status = {
      ...this.status,
      duration,
      progress: { seconds, percent },
    };
    if (this.secondary) {
      this.secondary.currentTime().then((currentTime) => {
        const skew = Math.abs(currentTime - seconds);
        if (skew > 1.0) {
          this.secondary.seek(seconds);
        }
      });
    }
  }

  @bind()
  protected _cueUpdate(seconds: number, refresh?: boolean) {
    const { activeCues } = this.status.subtitle;
    const cues = this.textTracks.getActiveCues(seconds);
    if (refresh || !this.textTracks.compareCueLists(cues, activeCues)) {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          activeCues: cues,
        },
      };
      // Notifies external listeners that the active cues have changed
      this.activeCueUpdateEvent.emit({ cues });
    }
  }

  @Listen('ratioLoaded')
  _resizeScreen(e: CustomEvent) {
    if (e.detail.name === 'primary') {
      this.primaryRatio = parseFloat(e.detail.ratio) * 100;
    } else {
      this.secondaryRatio = parseFloat(e.detail.ratio) * 100;
    }
  }

  /**
   * Listen to a Vimeo event 'seeked' that returns updated progress.
   * Triggered when the player seeks to a specific time. A timeupdate event will also be fired at the same time
   * then update the status accordingly
   */
  @Listen('seeked')
  private handleSeeked(e: CustomEvent<VimeoSeekedDetail>) {
    const { seconds, percent } = e.detail;
    this.status = {
      ...this.status,
      progress: {
        seconds,
        percent,
      },
    };
    this._cueUpdate(seconds);
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
    e: CustomEvent<ToggleControlProps>
  ) {
    const newToggleControlProps: ToggleControlProps = e.detail;

    this.toggleControlButtons = this.toggleControlButtons.map(
      (toggleControl) => {
        // apply changed props to player state, leave rest unchanged
        if (toggleControl.name === newToggleControlProps.name)
          return newToggleControlProps;
        return toggleControl;
      }
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
      this._setLanguage(this.lang);
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
    const { key } = e;
    const target = e.target as Element;

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

  @bind()
  @Listen('dblclick')
  private handleDoubleClick() {
    this.toggleFullscreen();
  }

  @Method()
  @Listen('control:play')
  public async play() {
    await this._invokePlayerFunction('play');
    this.status = { ...this.status, mode: Mode.PLAYING };
  }

  @Method()
  @Listen('control:pause')
  public async pause() {
    await this._invokePlayerFunction('pause');
    this.status = { ...this.status, mode: Mode.PAUSED };
  }

  @Method()
  public async seek(seconds: number) {
    await this._invokePlayerFunction('seek', [seconds]);
    // Sometimes seeking starts playing the video too.
    // Reset state to current stored player state.
    if (this.status.mode === Mode.PLAYING) {
      this.play();
    } else {
      this.pause();
    }
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
  protected async _enterFullscreen() {
    const element = this.el as any;
    const requestMethod =
      element.requestFullscreen ||
      element.webkitRequestFullScreen ||
      element.webkitEnterFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;
    if (requestMethod && !this.status.fullscreen) {
      return requestMethod.call(element);
    }
  }

  @Listen('control:exitFullscreen')
  protected async _exitFullscreen() {
    const doc = document as any;
    const fullscreen =
      doc.fullScreen || doc.mozFullScreen || doc.webkitIsFullScreen;
    if (fullscreen) {
      const requestMethod =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;
      if (requestMethod && this.status.fullscreen) {
        return requestMethod.call(doc);
      }
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
   * Values of the keyboard keys the player listens to on the 'keydown` event
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

  @bind()
  public _setLanguage(language: string) {
    const candidates: Array<string> = [
      language,
      navigator && navigator.language,
      this.el.closest('[lang]')?.getAttribute('lang')?.substr(0, 2),
    ];

    const chosen = candidates.find(isKnownLocale);

    this.status = {
      ...this.status,
      language: chosen || defaultStatus.language,
    };
  }

  @Watch('lang')
  _setupLanguage(newValue: string, oldValue: string) {
    if (newValue != oldValue) {
      this._setLanguage(newValue);
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
      this._cueUpdate(this.status.progress.seconds, true);
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
      this._exitFullscreen();
    } else {
      this._enterFullscreen();
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
    const progress = this.status.progress.seconds;
    const endOfVideo = this.status.duration;
    const newPosition =
      progress < endOfVideo - this.skippedSeconds
        ? progress + this.skippedSeconds
        : endOfVideo;

    this.seek(newPosition);
  }

  @bind()
  private skipBackward() {
    const progress = this.status.progress.seconds;
    const newPosition =
      progress < this.skippedSeconds ? 0 : progress - this.skippedSeconds;

    this.seek(newPosition);
  }
}
