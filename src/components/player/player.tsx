import {
  Component,
  Element,
  h,
  Method,
  State,
} from '@stencil/core';

import Tunnel, { Status, Mode } from '../../utils/status';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element()
  private el: HTMLElement;

  @State()
  private status: Status;

  private primary: HTMLXmVideoElement | undefined;
  private secondary: HTMLXmVideoElement | undefined;

  constructor() {
    this.status = {
      mode: Mode.PAUSED,
      fullscreen: false,
    };
  }

  protected render() {
    return (
      <Tunnel.Provider state={this.status}>
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

  @Method()
  public async play() {
    // this.status = {...this.status, mode: Mode.PLAYING};
    this.status.mode = Mode.PLAYING;
    console.log(this.status);
  }

  @Method()
  public async pause() {

  }
}
