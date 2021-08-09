import { Component, Element, Prop, h } from '@stencil/core';

@Component({
  tag: 'xm-tooltip',
  styleUrl: 'tooltip.scss',
  shadow: true,
})
export class Tooltip {
  @Element() el: HTMLXmTooltipElement;

  @Prop() show: boolean;
  @Prop() content: string;
  // Optional props. Default left position is 50%.
  @Prop() positionX?: number;

  componentDidUpdate() {
    if (this.positionX) {
      this.el.style.left = `${this.positionX - this.el.clientWidth * 0.5}px`;
    }
  }

  public render() {
    return (
      <div class="tooltip" role="tooltip" hidden={!this.show}>
        <p>{this.content}</p>
      </div>
    );
  }
}
