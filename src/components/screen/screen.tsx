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
  @Element() el: HTMLXmScreenElement;

  @Prop() fullscreen: boolean;

  @Prop() pip: boolean;

  @State() pipFlip: boolean = false;

  @State() orientationVertical: boolean;

  @Prop() primaryRatio: number;

  @Prop() secondaryRatio: number;

  private split: Split.Instance;

  private primary: HTMLElement;

  private secondary: HTMLElement;

  disconnectedCallback() {
    this.split.destroy();
  }

  componentDidRender() {
    if (this.primaryRatio && this.secondaryRatio) {
      // Initialization of video orientation when rendered
      this.initSplitScreen();
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

  private initSplitScreen() {
    // reinitialize in case component did rerender
    if (this.split) {
      this.split.destroy();
    }

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

  /**
   * This method is triggered by all video child web-components within the componentDidLoad method.
   * Every time a video child component was rendered the first time and the iframe in it was loaded,
   * we will get the current ratio of it asynchronously.
   * @param e CustomEvent
   */
  @bind()
  @Listen('resize', { target: 'window' })
  handleScreenSize() {
    if (
      (window.innerWidth < 768 && !this.orientationVertical) ||
      (window.innerWidth >= 768 && this.orientationVertical)
    ) {
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
