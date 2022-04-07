import {
  Component,
  Element,
  h,
  Method,
  Prop,
  State,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';

import Player from '@vimeo/player';
import { XmVideo, VideoAnalytics } from '../../types/common';

@Component({
  tag: 'xm-video',
  styleUrl: 'video.scss',
  shadow: true,
})
export class Video implements XmVideo, VideoAnalytics {
  @Element() el: HTMLXmVideoElement;

  /**
   * Vimeo Video ID
   */
  @Prop() src: number;

  @Prop() volume: number;

  @State() private ratio: number; // = 0.5625;

  private container: HTMLElement;

  @State() private player: Player;

  @Event({ eventName: 'play' }) playEvent: EventEmitter;

  @Event({ eventName: 'pause' }) pauseEvent: EventEmitter;

  @Event({ eventName: 'timeupdate' }) timeUpdateEvent: EventEmitter;

  @Event({ eventName: 'progress' }) progressEvent: EventEmitter;

  @Event({ eventName: 'seeking' }) seekingEvent: EventEmitter;

  @Event({ eventName: 'seeked' }) seekedEvent: EventEmitter;

  @Event({ eventName: 'ended' }) endedEvent: EventEmitter;

  @Event({ eventName: 'buffering' }) bufferingEvent: EventEmitter;

  @Event({ eventName: 'buffered' }) bufferedEvent: EventEmitter;

  @Event({ eventName: 'ratioLoaded' }) ratioLoadedEvent: EventEmitter;

  render() {
    return (
      <xm-aspect-ratio-box ratio={this.ratio}>
        <div ref={(el) => (this.container = el)}>
          <iframe class="video-iframe" />
        </div>

        <div class="overlay" tabindex="0">
          <slot name="overlay" />
        </div>
      </xm-aspect-ratio-box>
    );
  }

  async componentDidLoad() {
    /**
     * IE11 hack:
     * We need to save the given stencil 'magic' class from our placeholder to
     * place it to the new js generated iframe.
     */
    const iframePlaceholder = this.container.querySelector('iframe');
    const classesForIE11 = iframePlaceholder.getAttribute('class');
    if (iframePlaceholder) {
      iframePlaceholder.remove();
    }

    // Initialize Vimeo Player
    this.player = new Player(this.container, {
      id: this.src,
      controls: false,
      autopause: false,
    });

    Promise.all([
      this.player.getVideoWidth(),
      this.player.getVideoHeight(),
    ]).then((dimensions) => {
      this.ratio = dimensions[1] / dimensions[0];
      this.ratioLoadedEvent.emit({
        name: this.el.getAttribute('slot'),
        ratio: this.ratio,
      });
    });

    this.player.on('play', (e) => {
      // When seeking a play event is emitted without payload, ignore that.
      if (e !== undefined) this.playEvent.emit(e);
    });

    this.player.on('pause', (e) => this.pauseEvent.emit(e));
    this.player.on('timeupdate', (e) => this.timeUpdateEvent.emit(e));
    this.player.on('progress', (e) => this.progressEvent.emit(e));
    this.player.on('seeking', (e) => this.seekingEvent.emit(e));
    this.player.on('seeked', (e) => this.seekedEvent.emit(e));
    this.player.on('ended', (e) => this.endedEvent.emit(e));

    this.player.on('bufferstart', (e) => this.bufferingEvent.emit(e));
    this.player.on('bufferend', (e) => this.bufferedEvent.emit(e));

    // Wait for Vimeo Player to be ready to access the actual iframe element
    await this.player.ready();

    // add classes for IE11
    const iframe = this.container.querySelector('iframe');
    if (iframe) {
      iframe.className += ` ${classesForIE11}`;
    }

    // Sometimes vimeo videos has texttrack enabled per default
    await this.player.disableTextTrack();

    // Emit one default timeupdate event to update player with duration
    this.player.getDuration().then((duration) => {
      const e = new CustomEvent('timeupdate', {
        detail: { duration, seconds: 0, percent: 0 },
      });

      this.el.dispatchEvent(e);
    });

    // As controls are disabled we do not want the iframe to be
    // focusable by tabbing
    // @ts-ignore
    this.player.element.tabIndex = -1;

    // Read aspect ratio from video to configure view box
    this.ratio = await this.getAspectRatio();

    // This event indicates the video component is loaded and ready
    this.el.dispatchEvent(new CustomEvent('ready'));
  }

  async disconnectedCallback() {
    this.player.destroy();
  }

  @Watch('src')
  async srcChanged(value: number) {
    await this.player.loadVideo(value);
  }

  @Watch('volume')
  async volumeChanged(volume: number) {
    return this.player.setVolume(volume);
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
      this.player.getVideoHeight(),
    ]).then((dimensions) => ({ width: dimensions[0], height: dimensions[1] }));
  }

  @Method()
  async getAspectRatio() {
    return this.getDimensions().then(({ width, height }) => height / width);
  }

  @Method()
  async seek(seconds: number) {
    return this.player.setCurrentTime(seconds);
  }

  @Method()
  async currentTime() {
    return this.player.getCurrentTime();
  }

  @Method()
  async setPlaybackRate(playbackRate: number) {
    return this.player.setPlaybackRate(playbackRate);
  }
}
