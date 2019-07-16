import {
  Component,
  Element,
  h,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import Player from '@vimeo/player';

@Component({
  tag: 'xm-video',
  styleUrl: 'video.scss',
  shadow: true
})
export class Video {
  @Element() el: HTMLElement;

  /**
   * Vimeo Video ID
   */
  @Prop() src: number;

  @State() private ratio: number = 0.5625;

  private container: HTMLElement;
  @State() private player: Player;

  render() {
    return (
      <xm-aspect-ratio-box ratio={this.ratio}>
        <div ref={(el) => this.container = el} />
        <div class="overlay"><slot name="overlay" /></div>
      </xm-aspect-ratio-box>
    );
  }

  async componentDidLoad() {
    // With HMR the `load` lifecycle event is triggered but not the `unload`
    // event. This will lead to reusing the same Vimeo Player and registering
    // the event over and over again.
    //
    // If we detect that the vimeo-initialize data attribute is set we are
    // probably running on an already initialized DOM. For now manually trigger
    // an unload here.
    //
    // See https://github.com/ionic-team/stencil/issues/1316
    //
    if(this.container && this.container.dataset.vimeoInitialized) {
      this.componentDidUnload();
    }

    // Initialize Vimeo Player
    this.player = new Player(this.container, {
      id: this.src,
      controls: false,
      autopause: false,
    });

    this.player.on('play', (e) => {
      // When seeking a play event is emitted without payload, ignore that.
      if(e !== undefined)
        this.el.dispatchEvent(new CustomEvent('play', { detail: e }));
    });

    this.player.on('pause', (e) => {
      this.el.dispatchEvent(new CustomEvent('pause', { detail: e }));
    });

    this.player.on('seeking', (e) => {
      this.el.dispatchEvent(new CustomEvent('seeking', { detail: e }));
    });

    this.player.on('seeked', (e) => {
      this.el.dispatchEvent(new CustomEvent('seeked', { detail: e }));
    });

    this.player.on('ended', (e) => {
      this.el.dispatchEvent(new CustomEvent('ended'));
    });

    this.player.on('bufferstart', (e) => {
      this.el.dispatchEvent(new CustomEvent('bufferstart'));
    });

    this.player.on('bufferend', (e) => {
      this.el.dispatchEvent(new CustomEvent('bufferend'));
    });

    this.player.on('timeupdate', (e) => {
      this.el.dispatchEvent(new CustomEvent('timeupdate', { detail: e }));
    });

    this.player.on('progress', (e) => {
      this.el.dispatchEvent(new CustomEvent('progress', { detail: e }));
    });

    // Wait for Vimeo Player to be ready to access the actual iframe element
    await this.player.ready();

    // As controls are disabled we do not want the iframe to be
    // focusable by tabbing
    // @ts-ignore
    this.player.element.tabIndex = -1;

    // Read aspect ratio from video to configure view box
    this.ratio = await this.getAspectRatio();
  }

  async componentDidUnload() {
    this.player.destroy();
  }

  @Watch('src')
  async srcChanged(value: number) {
    await this.player.loadVideo(value);
  }

  @Watch('controls')
  async controlsChanged(value: boolean) {
    await this.componentDidUnload();
    return this.componentDidLoad();
  }

  @Method()
  async play() {
    return this.player.play();
  }

  @Method()
  async pause() {
    return this.player.pause();
  }

  @Method()
  async getDuration() {
    return this.player.getDuration();
  }

  @Method()
  async getDimensions() {
    return Promise.all([
      this.player.getVideoWidth(),
      this.player.getVideoHeight()
    ]).then((dimensions) => {
      return {width: dimensions[0], height: dimensions[1]}
    });
  }

  @Method()
  async getAspectRatio() {
    return this.getDimensions().then(({width, height}) => {
      return height / width;
    });
  }

  @Method()
  async seek(seconds: number) {
    return this.player.setCurrentTime(seconds);
  }

  @Method()
  async currentTime() {
    return this.player.getCurrentTime();
  }
}
