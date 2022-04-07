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
} from '../../types/common';

import { defaultStatus } from '../../utils/status';

@Component({
  tag: 'xm-kaltura',
  styleUrl: 'kaltura.scss',
})
export class Kaltura implements XmVideo, VideoAnalytics {
  player;

  playerContainer: HTMLXmAspectRatioBoxElement;

  userSettings = {
    playbackrate: defaultStatus.settings.playbackRate,
    volume: defaultStatus.volume,
  };

  @Element() el: HTMLXmVideoElement;

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

  @Prop() volume: number;

  @Event({ eventName: 'timeupdate' })
  timeUpdateEvent: EventEmitter<TimeUpdateDetail>;

  @Event({ eventName: 'ratioLoaded' })
  ratioLoadedEvent: EventEmitter<RatioLoadedDetail>;

  @Event({ eventName: 'ended' }) endedEvent: EventEmitter;

  @Event({ eventName: 'play' }) playEvent: EventEmitter;

  @Event({ eventName: 'pause' }) pauseEvent: EventEmitter;

  @Event({ eventName: 'seeked' }) seekedEvent: EventEmitter;

  // eslint-disable-next-line @stencil/no-unused-watch
  @Watch('volume')
  async volumeChanged(volume: number) {
    if (this.player) {
      return (this.player.volume = volume);
    } else {
      // Save the volume value in the userSettings property
      // if the player is not initialized. This function will be
      // called again once the player is ready.
      this.userSettings.volume = volume;
    }
  }

  async componentDidLoad() {
    const { Core, Provider } = await import('./kaltura-module');

    // See https://github.com/kaltura/playkit-js-providers
    const provider = await new Provider.Provider({
      partnerId: this.partnerId,
    });
    const mediaInfo = await provider.getMediaConfig({ entryId: this.entryId });

    // See https://github.com/kaltura/playkit-js
    this.player = await Core.loadPlayer();

    this.player.setSources(mediaInfo.sources);
    this.playerContainer.appendChild(this.player.getView());

    /**
     * Set pre-defined user settings. Use default settings as fallback.
     */
    this.setPlaybackRate(this.userSettings.playbackrate);
    this.volumeChanged(this.userSettings.volume);

    this.timeUpdateEvent.emit({
      duration: this.duration,
      seconds: 0,
      percent: 0,
    });

    this.ratioLoadedEvent.emit({
      name: this.el.getAttribute('slot'),
      ratio: this.ratio,
    });

    this.player.addEventListener('timeupdate', () => {
      this.timeUpdateEvent.emit({
        duration: this.duration,
        seconds: this.player.currentTime,
      });
    });

    this.player.addEventListener('ended', (e) => {
      this.endedEvent.emit(e);
    });

    /**
     * Emit events to tack via lanalytics
     */
    this.player.addEventListener('play', (e) => this.playEvent.emit(e));
    this.player.addEventListener('pause', (e) => this.pauseEvent.emit(e));
    this.player.addEventListener('seeked', (e) => this.seekedEvent.emit(e));
  }

  disconnectedCallback() {
    this.player.destroy();
  }

  /**
   *
   */
  @Method()
  async currentTime() {
    return this.player.currentTime;
  }

  /**
   *
   */
  @Method()
  async pause() {
    this.player.pause();
  }

  /**
   *
   */
  @Method()
  async play() {
    this.player.play();
  }

  /**
   *
   * @param seconds
   */
  @Method()
  async seek(seconds: number) {
    return (this.player.currentTime = seconds);
  }

  /**
   *
   * @param playbackRate
   */
  @Method()
  async setPlaybackRate(playbackRate: number) {
    if (this.player) {
      return (this.player.playbackRate = playbackRate);
    } else {
      // Save the playbackRate value in the userSettings property
      // if the player is not initialized. This function will be
      // called again once the player is ready.
      this.userSettings.playbackrate = playbackRate;
    }
  }

  render() {
    return (
      <xm-aspect-ratio-box
        ref={(e) => (this.playerContainer = e)}
        ratio={this.ratio}
      ></xm-aspect-ratio-box>
    );
  }
}
