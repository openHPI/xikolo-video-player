import {
  Component,
  Element,
  Prop,
  h,
  State,
  Watch,
  Listen,
} from '@stencil/core';

import Split from 'split.js';
import { bind } from '../../utils/bind';
import * as icon from '../../utils/icon';

@Component({
  tag: 'xm-screen',
  styleUrl: 'screen.scss',
  shadow: true,
})
export class Screen {
  @Element() el: HTMLElement;

  @Prop() fullscreen: boolean;
  @Prop() pip: boolean;
  @State() pipFlip: boolean = false;
  @State() orientationVertical: boolean;

  private split: Split.Instance;
  private primary: HTMLElement;
  private secondary: HTMLElement;
  private primaryRatio: number = null;
  private secondaryRatio: number = null;

  /**
   * Override of gutter creation function for horizontal alignment
   * See: https://github.com/nathancahill/split/tree/master/packages/splitjs#gutter
   */
  private gutter() {
    const gutter = document.createElement('div');
    gutter.className = `gutter gutter--horizontal`;

    const handlerTemplate = `
    <span class="gutter__draggable-area">
      <span class="gutter__handle">
        <span class="gutter__arrow gutter__arrow--left">${icon.ArrowLeft}</span>
        <span class="gutter__arrow gutter__arrow--right">${icon.ArrowRight}</span>
      </span>
    </span>
    `;
    gutter.innerHTML = handlerTemplate;

    return gutter;
  }

  initSplitScreen() {
    // Mobile view is vertical
    if (window.innerWidth < 768) {
      this.orientationVertical = true;
      this.split = Split([this.primary, this.secondary], {
        sizes: [this.secondaryRatio, this.primaryRatio],
        gutterSize: 6,
        direction: 'vertical',
      });
    } else {
      this.orientationVertical = false;
      this.split = Split([this.primary, this.secondary], {
        sizes: [this.secondaryRatio, this.primaryRatio],
        gutterSize: 6,
        direction: 'horizontal',
        gutter: this.gutter,
      });
    }
  }

  render() {
    const clWrp = {
      landscape: !this.orientationVertical,
      portrait: this.orientationVertical,
      fullscreen: this.fullscreen,
      pip: this.pip,
      flip: this.pipFlip,
    };

    return (
      <div class={clWrp}>
        <div
          class="pane primary"
          ref={(e) => (this.primary = e)}
          onMouseEnter={() => this._flipPipLeft()}
        >
          <slot name="primary" />
        </div>
        {/* gutter: Split JS automatically inserts div here  */}
        <div class="pane secondary" ref={(e) => (this.secondary = e)}>
          <slot name="secondary" />
        </div>
      </div>
    );
  }

  disconnectedCallback() {
    this.split.destroy();
  }

  /**
   * This method is triggered by all video child web-components within the componentDidLoad method.
   * Every time a video child component was rendered the first time and the iframe in it was loaded,
   * we will get the current ratio of it asynchronously.
   * @param e CustomEvent
   */
  @bind()
  @Listen('resize', { target: 'window' })
  handleScreenSize(ev: CustomEvent) {
    if (
      (window.innerWidth < 768 && !this.orientationVertical) ||
      (window.innerWidth >= 768 && this.orientationVertical)
    ) {
      this.split.destroy();
      this.initSplitScreen();
    }
  }

  @Listen('ratioLoaded')
  _resizeScreen(e: CustomEvent) {
    if (e.detail.name === 'primary') {
      this.primaryRatio = parseFloat(e.detail.ratio) * 100;
    } else {
      this.secondaryRatio = parseFloat(e.detail.ratio) * 100;
    }

    if (this.primaryRatio && this.secondaryRatio) {
      // Initialization of video orientation when first rendered
      this.initSplitScreen();
    }
  }

  @Watch('pip')
  _setupPip(newValue: boolean, oldValue: boolean) {
    if (newValue || !oldValue) return;

    this.pipFlip = false;
  }

  private _flipPipLeft() {
    if (!this.pip) return;

    this.pipFlip = !this.pipFlip;
  }
}
