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

import type Player from '@vimeo/player';

import { XmVideo, VideoAnalytics } from '../../../types/common';

@Component({
  tag: 'xm-vimeo',
  styleUrl: 'vimeo.scss',
  shadow: true,
})
export class Vimeo implements XmVideo, VideoAnalytics {
  callbacks: Function[] = [];

  @Element() el: HTMLXmVimeoElement;

  @Prop() active = false;

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

  /**
   * The buffering event is not handled to use the build in loading indicator.
   */
  @Event({ eventName: 'buffering' }) bufferingEvent: EventEmitter;

  /**
   * The buffered event is not handled to use the build in loading indicator.
   */
  @Event({ eventName: 'buffered' }) bufferedEvent: EventEmitter;

  @Event({ eventName: 'ratioLoaded' }) ratioLoadedEvent: EventEmitter;

  render() {
    if (!this.active) return;

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
    if (!this.active) return;
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

    const { default: Player } = await import('@vimeo/player');
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
        detail: { duration, seconds: 0 },
      });

      this.el.dispatchEvent(e);
    });

    // As controls are disabled we do not want the iframe to be
    // focusable by tabbing
    // @ts-ignore
    this.player.element.tabIndex = -1;

    // Read aspect ratio from video to configure view box
    this.ratio = await this.getAspectRatio();

    // Call all functions collected before the player was ready
    this.applyCallbacks();

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
    if (this.playerAvailable()) {
      return this.player.setVolume(volume);
    } else {
      this.addToCallBacks(() => this.player.setVolume(volume));
    }
  }

  /**
   * Call play on the Vimeo player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async play() {
    if (this.playerAvailable()) {
      return this.player.play();
    } else {
      this.addToCallBacks(() => this.player.play());
    }
  }

  /**
   * Call pause on the Vimeo player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async pause() {
    if (this.playerAvailable()) {
      return this.player.pause();
    } else {
      this.addToCallBacks(() => this.player.pause());
    }
  }

  /**
   * Call seek on the Vimeo player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async seek(seconds: number) {
    if (this.playerAvailable()) {
      return this.player.setCurrentTime(seconds);
    } else {
      this.addToCallBacks(() => this.player.setCurrentTime(seconds));
    }
  }

  /**
   * Call getCurrentTime on the Vimeo player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async currentTime() {
    if (this.playerAvailable()) {
      return this.player.getCurrentTime();
    } else {
      this.addToCallBacks(() => this.player.getCurrentTime());
    }
  }

  /**
   * Call setPlaybackRate on the Vimeo player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async setPlaybackRate(playbackRate: number) {
    if (this.playerAvailable()) {
      return this.player.setPlaybackRate(playbackRate);
    } else {
      this.addToCallBacks(() => this.player.setPlaybackRate(playbackRate));
    }
  }

  private playerAvailable() {
    return this.player != null;
  }

  private addToCallBacks(fn: Function) {
    this.callbacks.push(fn);
  }

  /**
   * Calls all functions in the callback array
   * Empties the queue after that
   */
  private applyCallbacks() {
    this.callbacks.forEach((fn) => {
      fn();
    });
    this.callbacks = [];
  }

  private async getDimensions() {
    return Promise.all([
      this.player.getVideoWidth(),
      this.player.getVideoHeight(),
    ]).then((dimensions) => ({ width: dimensions[0], height: dimensions[1] }));
  }

  private getAspectRatio() {
    return this.getDimensions().then(({ width, height }) => height / width);
  }
}
