import {
  Component,
  Element,
  h,
  Listen,
  Method,
  State,
} from '@stencil/core';

import Tunnel, { PlayerState, Mode } from '../../utils/status';

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
      <Tunnel.Provider state={this.state}>
        <div class="player">
          <xm-screen>
            <slot name="primary"></slot>
            <slot slot="secondary" name="secondary"></slot>
          </xm-screen>
          <xm-controls />
        </div>
      </Tunnel.Provider>
    );
  }

  protected componentDidLoad() {
    this.primary = this.el.querySelector('[slot=primary]') as HTMLXmVideoElement;
    this.secondary = this.el.querySelector('[slot=secondary]') as HTMLXmVideoElement;
  }

  protected componentWillUnload() {

  }

  @Listen('control:play')
  public async handlePlay() {
    return this.play();
  }

  @Listen('control:pause')
  public async handlePause() {
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
