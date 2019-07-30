import {
  Component,
  Element,
  h,
  Listen,
  Method,
  State,
} from '@stencil/core';

import { PlayerState, Mode } from '../../utils/state';
import { bind } from '../../utils/bind';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element()
  private el: HTMLElement;

  @State()
  private state: PlayerState;

  private primary: HTMLXmVideoElement | undefined;
  private secondary: HTMLXmVideoElement | undefined;

  constructor() {
    this.state = {
      mode: Mode.PAUSED,
      fullscreen: false,
    };
  }

  protected render() {
    return (
      <div class="player">
        <xm-screen>
          <slot name="primary"></slot>
          <slot slot="secondary" name="secondary"></slot>
        </xm-screen>
        <xm-controls />
      </div>
    );
  }

  protected componentDidLoad() {
    this.primary = this.el.querySelector('[slot=primary]') as HTMLXmVideoElement;
    this.secondary = this.el.querySelector('[slot=secondary]') as HTMLXmVideoElement;

    this.primary.addEventListener('click', this._handleVideoClick);
    this.secondary.addEventListener('click', this._handleVideoClick);
  }

  protected componentWillUnload() {
    this.primary.removeEventListener('click', this._handleVideoClick);
    this.secondary.removeEventListener('click', this._handleVideoClick);
  }

  @bind()
  protected async _handleVideoClick(e: MouseEvent) {
    console.log('_handleVideoClick', e);

    if(e.defaultPrevented) return;

    switch(this.state.mode) {
      case Mode.PAUSED:
      case Mode.FINISHED:
        return this.play();
      default:
        return this.pause();
    }
  }

  @Listen('control:play')
  protected async _handlePlay() {
    return this.play();
  }

  @Listen('control:pause')
  protected async _handlePause() {
    return this.pause();
  }

  @Method()
  public async play() {
    await Promise.all([this.primary.play(), this.secondary.play()]);
    this.state = {...this.state, mode: Mode.PLAYING};
  }

  @Method()
  public async pause() {
    await Promise.all([this.primary.pause(), this.secondary.pause()]);
    this.state = {...this.state, mode: Mode.PAUSED};
  }
}
