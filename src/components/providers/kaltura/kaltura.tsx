import {
  Component,
  Element,
  h,
  Method,
  Prop,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';

import {
  RatioLoadedDetail,
  TimeUpdateDetail,
  XmVideo,
  VideoAnalytics,
} from '../../../types/common';

@Component({
  tag: 'xm-kaltura',
  styleUrl: 'kaltura.scss',
})
export class Kaltura implements XmVideo, VideoAnalytics {
  player: any;

  playerContainer: HTMLXmAspectRatioBoxElement;

  callbacks: Function[] = [];

  @Element() el: HTMLXmKalturaElement;

  @Prop() active = false;

  /**
   * Number resulting from dividing the height by the width of the
   * video. Common ratios are 0.75 (4:3) and 0.5625 (16:9)
   */
  @Prop() ratio: number;

  /**
   * Duration of the video in seconds
   */
  @Prop() duration: number;

  @Prop() entryId: string;

  @Prop() partnerId: number;

  /**
   * URL for a poster to be displayed initially
   */
  @Prop() poster: string;

  @Prop() volume: number;

  @Event({ eventName: 'timeupdate' })
  timeUpdateEvent: EventEmitter<TimeUpdateDetail>;

  @Event({ eventName: 'ratioLoaded' })
  ratioLoadedEvent: EventEmitter<RatioLoadedDetail>;

  @Event({ eventName: 'ended' }) endedEvent: EventEmitter;

  @Event({ eventName: 'play' }) playEvent: EventEmitter;

  @Event({ eventName: 'pause' }) pauseEvent: EventEmitter;

  @Event({ eventName: 'seeked' }) seekedEvent: EventEmitter;

  @Event({ eventName: 'buffering' }) bufferingEvent: EventEmitter;

  @Event({ eventName: 'buffered' }) bufferedEvent: EventEmitter;

  @Watch('volume')
  async volumeChanged(volume: number) {
    if (this.playerAvailable()) {
      return (this.player.volume = volume);
    } else {
      this.addToCallBacks(() => (this.player.volume = volume));
    }
  }

  async componentDidLoad() {
    if (!this.active) return;

    const { Core, Provider } = await import('./kaltura-module');

    // See https://github.com/kaltura/playkit-js-providers
    const provider = await new Provider.Provider({
      partnerId: this.partnerId,
    });
    const mediaInfo = await provider.getMediaConfig({ entryId: this.entryId });

    // Add poster to sources
    mediaInfo.sources.poster = this.poster;

    // See https://github.com/kaltura/playkit-js
    this.player = await Core.loadPlayer();

    this.player.setSources(mediaInfo.sources);
    this.playerContainer.appendChild(this.player.getView());

    this.timeUpdateEvent.emit({
      duration: this.duration,
      seconds: 0,
    });

    this.ratioLoadedEvent.emit({
      name: this.el.getAttribute('slot'),
      ratio: this.ratio,
    });

    this.player.addEventListener('waiting', () => {
      this.bufferingEvent.emit();
    });

    this.player.addEventListener('playing', () => {
      this.bufferedEvent.emit();
    });

    this.player.addEventListener('timeupdate', () => {
      this.timeUpdateEvent.emit({
        duration: this.duration,
        seconds: this.player.currentTime,
      });
    });

    this.player.addEventListener('ended', (e: Event) => {
      this.endedEvent.emit(e);
    });

    /**
     * Emit events to tack via lanalytics
     */
    this.player.addEventListener('play', (e: Event) => this.playEvent.emit(e));
    this.player.addEventListener('pause', (e: Event) =>
      this.pauseEvent.emit(e)
    );
    this.player.addEventListener('seeked', (e: Event) =>
      this.seekedEvent.emit(e)
    );

    // Call all functions collected before the player was ready
    this.applyCallbacks();
  }

  disconnectedCallback() {
    this.player.destroy();
  }

  /**
   * Call getCurrentTime on the Kaltura player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async currentTime() {
    if (this.playerAvailable()) {
      return this.player.currentTime;
    } else {
      this.addToCallBacks(() => this.player.currentTime);
    }
  }

  /**
   * Call pause on the Kaltura player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async pause() {
    if (this.playerAvailable()) {
      this.player.pause();
    } else {
      this.addToCallBacks(() => this.player.pause());
    }
  }

  /**
   * Call play on the Kaltura player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async play() {
    if (this.playerAvailable()) {
      this.player.play();
    } else {
      this.addToCallBacks(() => this.player.play());
    }
  }

  /**
   * Call seek on the Kaltura player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async seek(seconds: number) {
    if (this.playerAvailable()) {
      return (this.player.currentTime = seconds);
    } else {
      this.addToCallBacks(() => (this.player.currentTime = seconds));
    }
  }

  /**
   * Call setPlaybackRate on the Kaltura player
   *
   * If the player is not initialized, it will save the function
   * so it can be applied once the player is ready.
   */
  @Method()
  async setPlaybackRate(playbackRate: number) {
    if (this.playerAvailable()) {
      return (this.player.playbackRate = playbackRate);
    } else {
      this.addToCallBacks(() => (this.player.playbackRate = playbackRate));
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

  render() {
    if (!this.active) return;

    return (
      <xm-aspect-ratio-box
        ref={(e) => (this.playerContainer = e)}
        ratio={this.ratio}
      ></xm-aspect-ratio-box>
    );
  }
}
