import {
  Component,
  Element,
  Prop,
  h,
  State,
  Watch,
} from '@stencil/core';

import Split from 'split.js'

@Component({
  tag: 'xm-screen',
  styleUrl: 'screen.scss',
  shadow: true
})
export class VideoPlayer {
  @Element() el: HTMLElement;

  @Prop() pip: boolean;
  @State() pipFlip: boolean = false;

  private screen: HTMLDivElement;
  private engine: Split;

  render() {
    const clWrp = {
      screen: true,
      pip: this.pip,
      flip: this.pipFlip
    };

    return (
      <div class={clWrp} ref={(e) => this.screen = e}>
        <div class="pane primary" onMouseEnter={() => this._flipPipLeft()}><slot /></div>
        <div class="pane secondary"><slot name="secondary" /></div>
      </div>
    );
  }

  componentDidLoad() {
    this.engine = Split(this.screen.childNodes, {
      gutterSize: 6
    });
  }

  componentDidUnload() {
    this.engine.destroy()
  }

  @Watch('pip')
  _setupPip(newValue: boolean, oldValue: boolean) {
    if(newValue || !oldValue) return;

    this.pipFlip = false;
  }

  private _flipPipLeft() {
    if(!this.pip) return;

    this.pipFlip = !this.pipFlip;
  }
}
