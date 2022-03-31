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
} from '../../types/common';

import { generateId } from '../../utils/helpers';
import { defaultStatus } from '../../utils/status';

@Component({
  tag: 'xm-kaltura',
  styleUrl: 'kaltura.scss',
})
export class Kaltura implements XmVideo {
  player;

  id = generateId('xm-aspect-ratio-box-');

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
    const module = await import('kaltura-player-js');
    this.player = module.setup({
      targetId: this.id,
      provider: {
        partnerId: this.partnerId,
      },
      playback: {
        autoplay: false,
      },
      ui: {
        disable: true,
      },
    });

    await this.player.loadMedia({ entryId: this.entryId });

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
        ratio={this.ratio}
        id={this.id}
      ></xm-aspect-ratio-box>
    );
  }
}
