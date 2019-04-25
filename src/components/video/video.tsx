import { Component, Prop } from '@stencil/core';

import Player from "@vimeo/player";

@Component({
  tag: 'xwc-video',
  styleUrl: 'video.scss',
  shadow: true
})
export class Video {
  @Prop() src: string;

  private ct: HTMLElement;

  getIFrameURL() {
    return '//player.vimeo.com/video/205404461?loop=0&autoplay=0&muted=0&' +
           'gesture=media&playsinline=true&byline=0&portrait=0&title=0' +
           'transparent=0&background=1';
  }

  render() {
    return (
      <div>
        <iframe src={this.getIFrameURL()} ref={e => this.ct = e } frameborder="0" />
      </div>
    );
  }

  async componentDidLoad() {
    const player = new Player(this.ct);

    await player.ready();

    // player.play();
  }
}
