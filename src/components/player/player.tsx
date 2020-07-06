import {
  Component,
  Element,
  h,
  Listen,
  Method,
  State,
  Prop,
  Watch,
} from '@stencil/core';

import { Mode, Status, defaultStatus } from '../../utils/status';
import { TextTrack, WebVTT } from '../../utils/webVTT';
import { bind } from '../../utils/bind';
import locales from "../../utils/locales";
import { textTrackDefault } from '../../utils/settings';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element()
  private el: HTMLXmPlayerElement;

  @Prop({mutable: true}) volume: number = defaultStatus.volume;
  @Prop({attribute: 'lang'}) lang: string;

  @State()
  private status: Status = defaultStatus;

  private primary: HTMLXmVideoElement | undefined;
  private secondary: HTMLXmVideoElement | undefined;
  private textTrack: TextTrack = new TextTrack();
  private hasSecondarySlot: boolean;

  public render() {
    return (
      <div class="player">
        { this.hasSecondarySlot ?
          <xm-screen fullscreen={this.status.fullscreen}>
            <slot slot="primary" name="primary"></slot>
            <slot slot="secondary" name="secondary"></slot>
          </xm-screen>
          :
          <slot slot="primary" name="primary"></slot>
        }
        <xm-controls status={this.status} textTrack={this.textTrack} />
      </div>
    );
  }

  componentWillLoad() {
    this.hasSecondarySlot = !!this.el.querySelector('[slot="secondary"]');
  }

  public componentDidLoad() {
    this.primary = this.el.querySelector('[slot=primary]') as HTMLXmVideoElement;
    this.secondary = this.el.querySelector('[slot=secondary]') as HTMLXmVideoElement;

    this.primary.addEventListener('click', this._click);
    this.primary.addEventListener('timeupdate', this._timeUpdate);
    this.primary.addEventListener('progress', this._progress);
    this.primary.addEventListener('ended', this._ended);
    if(this.secondary) {
      this.secondary.addEventListener('click', this._click);
      this.secondary.volume = 0;
    }

    document.addEventListener('fullscreenchange', this._fullscreenchange);
    document.addEventListener('MSFullscreenChange', this._fullscreenchange);
    document.addEventListener('webkitfullscreenchange', this._fullscreenchange);

    document.addEventListener('click', this._hideSettingsMenuOnClickOutside);

    this._setVolume(this.volume);
    this._setLanguage(this.lang);
  }

  public componentWillUnload() {
    this.primary.removeEventListener('click', this._click);
    this.primary.removeEventListener('timeupdate', this._timeUpdate);
    this.primary.removeEventListener('progress', this._progress);
    this.primary.removeEventListener('ended', this._ended);
    if(this.secondary) this.secondary.removeEventListener('click', this._click);

    document.removeEventListener('fullscreenchange', this._fullscreenchange);
    document.removeEventListener('MSFullscreenChange', this._fullscreenchange);
    document.removeEventListener('webkitfullscreenchange', this._fullscreenchange);

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
  private async _invokePlayerFunction(functionName:string, params?: any) {
    return Promise.all([
      this.primary[functionName].apply(this.primary, params),
      this.secondary ? this.secondary[functionName].apply(this.secondary, params) : null
    ]);
  }

  @bind()
  protected async _click(e: MouseEvent) {
    if(!this.status.openedSettingsMenu && !this.status.showPlaybackRate) {
      switch(this.status.mode) {
        case Mode.PAUSED:
        case Mode.FINISHED:
          return this.play();
        default:
          return this.pause();
      }
    }
  }

  @bind()
  protected async _hideSettingsMenuOnClickOutside(e: MouseEvent) {
    if(this.status.openedSettingsMenu || this.status.showPlaybackRate) {
      this._closeSettingsMenu();
      this._hidePlaybackRate();
    }
  }

  @bind()
  protected async _timeUpdate(e: CustomEvent) {
    const { seconds, percent, duration } = e.detail;
    this._cueUpdate(seconds);
    this.status = {
      ...this.status,
      duration: duration,
      progress: {seconds: seconds, percent: percent},
    };
    if(this.secondary) {
      this.secondary.currentTime().then((currentTime) => {
        const skew = Math.abs(currentTime - seconds);
        if(skew > 1.0) {
          this.secondary.seek(seconds);
        }
      })
    }
  }

  @bind()
  protected _cueUpdate(seconds: number, refresh?: boolean) {
    const { activeCues } = this.status.subtitle;
    const cues = this.textTrack.getActiveCues(seconds, this.status.subtitle.language);
    if(refresh || !this.textTrack.compareCueLists(cues, activeCues)) {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          activeCues: cues
        }
      };
    }
  }

  @bind()
  @Listen('texttrack:loaded')
  protected _addSubtitle(e: CustomEvent) {
    const vtt:WebVTT = e.detail.webVTT;
    this.textTrack.addWebVTT(vtt);
    if(vtt.meta.language === this.status.language) {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          language: this.status.language
        }
      }
    }
  }

  @Method()
  @Listen('control:play')
  public async play() {
    await this._invokePlayerFunction('play');
    this.status = {...this.status, mode: Mode.PLAYING};
  }

  @Method()
  @Listen('control:pause')
  public async pause() {
    await this._invokePlayerFunction('pause');
    this.status = {...this.status, mode: Mode.PAUSED};
  }

  @Method()
  public async seek(seconds: number) {
    await this._invokePlayerFunction('seek',[seconds]);
    // Sometimes seeking starts playing the video too.
    // Reset state to current stored player state.
    this.status.mode === Mode.PLAYING ? this.play() : this.pause();
  }

  @bind()
  protected async _progress(e: CustomEvent) {
    console.log('progress', e.detail);
  }

  @bind()
  protected async _ended(e: CustomEvent) {
    this.status = {...this.status, mode: Mode.FINISHED};
  }

  @bind()
  protected _fullscreenchange() {
    const doc = (document as any);
    const fullscreen = doc.fullScreen || doc.mozFullScreen || doc.webkitIsFullScreen;
    this.status = {...this.status, fullscreen: fullscreen};
  }

  @Listen('control:seek')
  protected async _seek(e: CustomEvent) {
    await this.seek(e.detail.seconds);
  }

  @Listen('control:enterFullscreen')
  protected async _enterFullscreen() {
    const element = (this.el as any);
    const requestMethod = element.requestFullscreen || element.webkitRequestFullScreen || element.webkitEnterFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen;
    if (requestMethod && !this.status.fullscreen) {
        return requestMethod.call(element);
    }
  }

  @Listen('control:exitFullscreen')
  protected async _exitFullscreen() {
    const doc = (document as any);
    const fullscreen = doc.fullScreen || doc.mozFullScreen || doc.webkitIsFullScreen;
    if(fullscreen) {
      const requestMethod = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
      if (requestMethod && this.status.fullscreen) {
        return requestMethod.call(doc);
      }
    }
  }

  @Listen('control:openSettingsMenu')
  protected async _openSettingsMenu() {
    this.status = {...this.status, openedSettingsMenu: true};
  }

  @Listen('control:closeSettingsMenu')
  protected async _closeSettingsMenu() {
    this.status = {...this.status, openedSettingsMenu: false};
  }

  @Method()
  @Listen('control:mute')
  public async mute() {
    this.primary.volume = 0;
    this.status = {...this.status, muted: true};
  }

  @Method()
  @Listen('control:unmute')
  public async unmute() {
    this.primary.volume = this.status.volume;
    this.status = {...this.status, muted: false};
  }


  @bind()
  public async _setVolume(volume: number) {
    if( !isNaN(volume) ) {
      this.volume = volume;
      this.primary.volume = this.volume;
      this.status = {
        ...this.status,
        volume: this.volume,
        muted: this.volume === 0
      };
    }
  }

  @Listen('control:changeVolume')
  public async _changeVolume(e: CustomEvent) {
    this._setVolume(e.detail.volume);
  }

  @Watch('volume')
  _setupVolume(newValue: string, oldValue: string) {
    const volume = parseFloat(newValue);
    if( newValue != oldValue ) {
      this._setVolume(volume);
    }
  }

  @Watch('lang')
  _setupLanguage(newValue: string, oldValue: string) {
    if( newValue != oldValue ) {
      this._setLanguage(newValue);
    }
  }

  @bind()
  public _setLanguage(language: string) {
    if(!language || !locales[language]) {
      if(navigator && navigator.language && locales[navigator.language]) {
        language = navigator.language;
      } else {
        const element = this.el.closest('[lang]');
        if(element) {
          const lang = element.getAttribute('lang').substr(0, 2);
          language = locales[lang] ? lang : defaultStatus.language;
        }
      }
    }
    this.status = {
      ...this.status,
      language: language
    }
  }

  @Listen('setting:changePlaybackRate')
  @Listen('control:changePlaybackRate')
  protected async _setPlaybackRate(e: CustomEvent) {
    const playbackRate = e.detail.playbackRate;
    await this._invokePlayerFunction('setPlaybackRate',[playbackRate]);
    this.status = {
      ...this.status,
      settings: {
        ...this.status.settings,
        playbackRate: playbackRate,
      }
    };
  }

  @Listen('control:showPlaybackRate')
  protected async _showPlaybackRate() {
    this.status = {...this.status, showPlaybackRate: true};
  }

  @Listen('control:hidePlaybackRate')
  protected async _hidePlaybackRate() {
    this.status = {...this.status, showPlaybackRate: false};
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
      }
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
        textTrack: textTrackDefault,
      }
    };
  }

  @Listen('setting:changeTextTrack')
  public _setTextTrack(e: CustomEvent) {
    const textTrack = e.detail.textTrack;
    if(textTrack === textTrackDefault) {
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          enabled: false,
        }
      };
    } else {
      this._cueUpdate(this.status.progress.seconds, true);
      this.status = {
        ...this.status,
        subtitle: {
          ...this.status.subtitle,
          language: textTrack,
          enabled: true,
        }
      };
    }
    this.status = {
      ...this.status,
      settings: {
        ...this.status.settings,
        textTrack: textTrack,
      }
    };

  }
}
