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

  @Prop() image?: string;

  // Optional props. Default left position is 50%.
  @Prop() positionX?: number;

  componentDidUpdate() {
    if (this.positionX) {
      const centeredPosition = this.positionX - this.el.clientWidth * 0.5;
      const containerWidth = this.el.parentElement.clientWidth;

      const overflowsToTheLeft = centeredPosition <= 0;
      const overflowsToTheRight =
        this.positionX + this.el.clientWidth * 0.5 >= containerWidth;

      if (overflowsToTheLeft) {
        this.el.style.left = `0px`;
      } else if (overflowsToTheRight) {
        this.el.style.left = `${containerWidth - this.el.clientWidth}px`;
      } else {
        this.el.style.left = `${centeredPosition}px`;
      }
    }
  }

  public render() {
    return (
      <div class="tooltip" role="tooltip" hidden={!this.show}>
        {this.image && <img class="tooltip__image" src={this.image}></img>}
        <p class="tooltip__content">{this.content}</p>
      </div>
    );
  }
}
