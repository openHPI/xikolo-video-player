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
import { bind } from '../../utils/bind';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element()
  private el: HTMLXmPlayerElement;

  @Prop({mutable: true}) volume: number = defaultStatus.volume;

  @State()
  private status: Status = defaultStatus;

  private primary: HTMLXmVideoElement | undefined;
  private secondary: HTMLXmVideoElement | undefined;

  public render() {
    return (
      <div class="player">
        <xm-screen>
          <slot name="primary"></slot>
          <slot slot="secondary" name="secondary"></slot>
        </xm-screen>
        <xm-controls status={this.status} />
      </div>
    );
  }

  public componentDidLoad() {
    this.primary = this.el.querySelector('[slot=primary]') as HTMLXmVideoElement;
    this.secondary = this.el.querySelector('[slot=secondary]') as HTMLXmVideoElement;

    this.primary.addEventListener('click', this._click);
    this.primary.addEventListener('timeupdate', this._timeUpdate);
    this.primary.addEventListener('progress', this._progress);
    this.primary.addEventListener('ended', this._ended);
    this.secondary.addEventListener('click', this._click);

    document.addEventListener('fullscreenchange', this._fullscreenchange);

    this._setVolume(this.volume);
  }

  public componentWillUnload() {
    this.primary.removeEventListener('click', this._click);
    this.primary.removeEventListener('timeupdate', this._timeUpdate);
    this.secondary.removeEventListener('click', this._click);
  }

  @bind()
  protected async _click(e: MouseEvent) {
    switch(this.status.mode) {
      case Mode.PAUSED:
      case Mode.FINISHED:
        return this.play();
      default:
        return this.pause();
    }
  }

  @bind()
  protected async _timeUpdate(e: CustomEvent) {
    const { seconds, percent, duration } = e.detail;
    this.status = {
      ...this.status,
      duration: duration,
      progress: {seconds: seconds, percent: percent},
    };

    this.secondary.currentTime().then((currentTime) => {
      const skew = Math.abs(currentTime - seconds);
      if(skew > 1.0) {
        this.secondary.seek(seconds);
      }
    })
  }

  @Method()
  @Listen('control:play')
  public async play() {
    await Promise.all([this.primary.play(), this.secondary.play()]);
    this.status = {...this.status, mode: Mode.PLAYING};
  }

  @Method()
  @Listen('control:pause')
  public async pause() {
    await Promise.all([this.primary.pause(), this.secondary.pause()]);
    this.status = {...this.status, mode: Mode.PAUSED};
  }

  @Method()
  public async seek(seconds: number) {
    await Promise.all([this.primary.seek(seconds), this.secondary.seek(seconds)]);
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
    this.status = {...this.status, fullscreen: document.fullscreenElement !== null}
  }

  @Listen('control:seek')
  protected async _seek(e: CustomEvent) {
    await this.seek(e.detail.seconds);
  }

  @Listen('control:enterFullscreen')
  protected async _enterFullscreen() {
    return this.el.requestFullscreen();
  }

  @Listen('control:exitFullscreen')
  protected async _exitFullscreen() {
    if (document.fullscreenElement !== null)
      return document.exitFullscreen();
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


  @Listen('setting:changePlaybackRate')
  protected async _setPlaybackRate(e: CustomEvent) {
    const playbackRate = e.detail.playbackRate;
    await this.primary.setPlaybackRate(playbackRate);
    this.status = {
      ...this.status,
      settings: {
        ...this.status.settings,
        playbackRate: playbackRate,
      }
    };
  }

}
