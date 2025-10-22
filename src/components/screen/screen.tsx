import { Component, Element, Prop, h, State, Listen } from '@stencil/core';

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

  @State() orientationPortrait: boolean;

  @Prop() fullscreen: boolean;

  @Prop() primaryRatio = 50;

  @Prop() secondaryRatio = 50;

  private split: Split.Instance;

  private primary: HTMLElement;

  private secondary: HTMLElement;

  disconnectedCallback() {
    this.split.destroy();
  }

  componentWillLoad() {
    this.setOrientation();
  }

  componentDidRender() {
    if (this.primaryRatio && this.secondaryRatio) {
      // Initialization of video orientation when rendered
      this.initSplitScreen();
    }
  }

  render() {
    const clWrp = {
      landscape: !this.orientationPortrait,
      portrait: this.orientationPortrait,
      fullscreen: this.fullscreen,
    };

    return (
      <div class={clWrp}>
        <div class="pane primary" ref={(e) => (this.primary = e!)}>
          <slot name="primary" />
        </div>
        {/* gutter: Split JS automatically inserts div here  */}
        <div class="pane secondary" ref={(e) => (this.secondary = e!)}>
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

    const options = {
      sizes: [this.secondaryRatio, this.primaryRatio],
      gutterSize: 6,
      minSize: [0, 0],
      snapOffset: 100,
    };

    if (this.hasSmallScreenWidth()) {
      this.split = Split([this.primary, this.secondary], {
        ...options,
        direction: 'vertical',
        gutter: this.gutterVertical,
      });
    } else {
      this.split = Split([this.primary, this.secondary], {
        ...options,
        direction: 'horizontal',
        gutter: this.gutterHorizontal,
      });
    }
  }

  /**
   * Override of gutter creation function for horizontal alignment
   * See: https://github.com/nathancahill/split/tree/master/packages/splitjs#gutter
   */
  private gutterHorizontal() {
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
   * Override of gutter creation function for vertical alignment
   */
  private gutterVertical() {
    const gutter = document.createElement('div');
    gutter.className = `gutter gutter--vertical`;

    const handlerTemplate = `
      <span class="gutter__draggable-area">
        <span class="gutter__handle">
          <span class="gutter__arrow gutter__arrow--up">${icon.ArrowUp}</span>
          <span class="gutter__arrow gutter__arrow--down">${icon.ArrowDown}</span>
        </span>
      </span>
      `;
    gutter.innerHTML = handlerTemplate;

    return gutter;
  }

  /**
   * On every window resize event,
   * the Screen needs to evaluate video arrangements (landscape / portrait).
   *
   * If there is a mismatch of these properties,
   * the Screen will re-render with the correct orientation
   */
  @bind()
  @Listen('resize', { target: 'window' })
  handleScreenSize() {
    if (
      (this.hasSmallScreenWidth() && !this.orientationPortrait) ||
      (!this.hasSmallScreenWidth() && this.orientationPortrait)
    ) {
      this.setOrientation();
    }
  }

  /**
   * Initially and after every window re-size,
   * the Screen need to evaluate orientation of the video streams
   *
   * On smaller screens, they are stacked on top of each other (portrait).
   * On bigger screens, there they are side by side (landscape).
   */
  private setOrientation() {
    if (this.hasSmallScreenWidth()) {
      this.orientationPortrait = true;
    } else {
      this.orientationPortrait = false;
    }
  }

  private hasSmallScreenWidth() {
    return window.innerWidth < 768;
  }
}
