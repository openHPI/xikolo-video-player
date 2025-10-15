import { Component, Element, h, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'xm-aspect-ratio-box',
  styleUrl: 'aspect-ratio-box.scss',
  shadow: true,
})
export class AspectRatioBox {
  @Element() el: HTMLXmAspectRatioBoxElement;

  /**
   * Video ratio, default is 16:9
   */
  @Prop() ratio: number = 0.5625;

  render() {
    return (
      <div class="bx" data-ratio={this.ratio === 0.75 ? '4:3' : ''}>
        <div class="ct">
          <slot />
        </div>
      </div>
    );
  }
}
