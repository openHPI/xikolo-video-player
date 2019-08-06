import {
  Component,
  Element,
  h,
  Listen,
  Method,
  State,
} from '@stencil/core';

import { Mode, Status, defaultStatus } from '../../utils/status';
import { bind } from '../../utils/bind';
import { isThisTypeNode } from 'typescript';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element()
  private el: HTMLElement;

  @State()
  private status: Status = defaultStatus;

  private primary: HTMLXmVideoElement | undefined;
  private secondary: HTMLXmVideoElement | undefined;

  protected render() {
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

  protected componentDidLoad() {
    this.primary = this.el.querySelector('[slot=primary]') as HTMLXmVideoElement;
    this.secondary = this.el.querySelector('[slot=secondary]') as HTMLXmVideoElement;

    this.primary.addEventListener('click', this._handleVideoClick);
    this.primary.addEventListener('timeupdate', this._handleVideoTimeUpdate);
    this.primary.addEventListener('progress', this._handleVideoProgress);
    this.secondary.addEventListener('click', this._handleVideoClick);
  }

  protected componentWillUnload() {
    this.primary.removeEventListener('click', this._handleVideoClick);
    this.primary.removeEventListener('timeupdate', this._handleVideoTimeUpdate);
    this.secondary.removeEventListener('click', this._handleVideoClick);
  }

  @bind()
  protected async _handleVideoClick(e: MouseEvent) {
    switch(this.status.mode) {
      case Mode.PAUSED:
      case Mode.FINISHED:
        return this.play();
      default:
        return this.pause();
    }
  }

  @bind()
  protected async _handleVideoTimeUpdate(e: CustomEvent) {
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

  @bind()
  protected async _handleVideoProgress(e: CustomEvent) {
    console.log('progress', e.detail);
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
  }

  @Listen('control:seek')
  public async _seek(e: CustomEvent) {
    await this.seek(e.detail.seconds);
  }
}
