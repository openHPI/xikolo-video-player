import {
  Component,
  Element,
  Prop,
  h,
  State,
  Watch,
  Listen,
} from '@stencil/core';

import Split from 'split.js'
import { bind } from '../../utils/bind';
import * as icon from '../../utils/icon';

@Component({
  tag: 'xm-screen',
  styleUrl: 'screen.scss',
  shadow: true
})
export class Screen {
  @Element() el: HTMLElement;

  @Prop() fullscreen: boolean;
  @Prop() pip: boolean;
  @State() pipFlip: boolean = false;

  private screen: HTMLDivElement;
  private engine: Split;
  private primaryRatio: number = null;
  private secondaryRatio: number = null;

  render() {
    const clWrp = {
      screen: true,
      fullscreen: this.fullscreen,
      pip: this.pip,
      flip: this.pipFlip
    };

    return (
      <div class={clWrp} ref={(e) => this.screen = e}>
        <div class="pane primary" onMouseEnter={() => this._flipPipLeft()}>
          <span class="pane__arrow pane__arrow--left">
            <span class="svg" innerHTML={icon.ArrowLeft} />
          </span>
          <slot name="primary"/>
        </div>
        <div class="gutter"></div>
        <div class="pane secondary">
            <span class="pane__arrow pane__arrow--right">
              <span class="svg" innerHTML={icon.ArrowRight} />
            </span>
            <slot name="secondary"/>
        </div>
      </div>
    );
  }

  componentDidUnload() {
    this.engine.destroy()
  }

  /**
   * This method is triggered by all video child web-componets within the componentDidLoad method.
   * Every time a video child component was rendered the first time and the iframe in it was loaded,
   * we will get the currect ratio of it asynchronously.
   * @param e CustomEvent
   */
  @bind()
  @Listen('ratioLoaded')
  _resizeScreen(e: CustomEvent) {
    if(e.detail.name === 'primary') {
      this.primaryRatio = parseFloat(e.detail.ratio) * 100;
    } else {
      this.secondaryRatio = parseFloat(e.detail.ratio) * 100;
    }

    if(this.primaryRatio && this.secondaryRatio) {
      /**
       * IE11 hack:
       * We need to save the given stencil 'magic' class from our placeholder to
       * place it to the new js generated gutter div.
       */
      const gutterPlaceholder = this.el.shadowRoot.querySelector('.gutter');
      const classesForIE11 = gutterPlaceholder.getAttribute('class');
      if(gutterPlaceholder) {
        gutterPlaceholder.remove();
      }
      this.engine = Split(this.screen.childNodes, {
        sizes: [this.secondaryRatio, this.primaryRatio],
        gutterSize: 6,
      });
      const gutter = this.el.shadowRoot.querySelector('.gutter');
      if(gutter) {
        gutter.className += ' '+ classesForIE11;
      }
    }
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
