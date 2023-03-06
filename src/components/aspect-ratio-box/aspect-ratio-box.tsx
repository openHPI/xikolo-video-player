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

  @State() fullscreen: boolean = this.isVideoInFullscreen();

  @Listen('fullscreenchange', { target: 'window' })
  @Listen('webkitfullscreenchange', { target: 'window' })
  handleFullscreenChange() {
    this.fullscreen = this.isVideoInFullscreen();
  }

  render() {
    return (
      <div
        class="bx"
        style={
          !this.fullscreen ? { 'padding-bottom': `${this.ratio * 100}%` } : {}
        }
      >
        <div class="ct">
          <slot />
        </div>
      </div>
    );
  }

  private isVideoInFullscreen() {
    const fullScreenElement =
      document.fullscreenElement || (document as any).webkitFullscreenElement;

    if (fullScreenElement) {
      return true;
    }
    return false;
  }
}
