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
  @Prop() volume: number;

  @State() private ratio: number; // = 0.5625;

  private container: HTMLElement;
  @State() private player: Player;

  @Event({eventName: 'play'}) playEvent: EventEmitter;
  @Event({eventName: 'pause'}) pauseEvent: EventEmitter;
  @Event({eventName: 'timeupdate'}) timeUpdateEvent: EventEmitter;
  @Event({eventName: 'progress'}) progressEvent: EventEmitter;
  @Event({eventName: 'seeking'}) seekingEvent: EventEmitter;
  @Event({eventName: 'seeked'}) seekedEvent: EventEmitter;
  @Event({eventName: 'ended'}) endedEvent: EventEmitter;

  @Event({eventName: 'buffering'}) bufferingEvent: EventEmitter;
  @Event({eventName: 'buffered'}) bufferedEvent: EventEmitter;

  @Event({eventName: 'ratioLoaded'}) ratioLoadedEvent: EventEmitter;


  /**
   * <iframe src="https://player.vimeo.com/video/340196868?autopause=0&amp;controls=0&amp;app_id=122963" allow="autoplay; fullscreen" allowfullscreen="" title="email2019-w1-10-lecturer" data-ready="true" tabindex="-1" width="426" height="240" frameborder="0"></iframe>
   */
  render() {
    return (
      <xm-aspect-ratio-box ratio={this.ratio}>
        <iframe
          ref={(el) => this.container = el}
          src={`https://player.vimeo.com/video/${this.src}/?autopause=0&controls=0&amp;app_id=122963`}
          width="426"
          height="240"
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <div class="overlay"><slot name="overlay" /></div>
      </xm-aspect-ratio-box>
    );
  }

  async componentDidLoad() {
    // Initialize Vimeo Player
    this.player = new Player(this.container, {
      id: this.src,
      controls: false,
      autopause: false,
    });
    this.player.getVideoTitle().then((title) => this.container.setAttribute('title', title));

    Promise.all([this.player.getVideoWidth(), this.player.getVideoHeight()]).then((dimensions) => {
      this.ratio = dimensions[1] / dimensions[0];
      this.ratioLoadedEvent.emit({
        name: this.el.getAttribute('slot'),
        ratio: this.ratio
      });
    });

    this.player.on('play', (e) => {
      // When seeking a play event is emitted without payload, ignore that.
      if(e !== undefined)
        this.playEvent.emit(e);
    });

    this.player.on('pause', e => this.pauseEvent.emit(e));
    this.player.on('timeupdate', e => this.timeUpdateEvent.emit(e));
    this.player.on('progress', e => this.progressEvent.emit(e));
    this.player.on('seeking', e => this.seekingEvent.emit(e));
    this.player.on('seeked', e => this.seekedEvent.emit(e));
    this.player.on('ended', e => this.endedEvent.emit(e));

    this.player.on('bufferstart', e => this.bufferingEvent.emit(e));
    this.player.on('bufferend', e => this.bufferedEvent.emit(e));

    // Wait for Vimeo Player to be ready to access the actual iframe element
    await this.player.ready();

    // Sometimes vimeo videos has texttrack enabled per default
    await this.player.disableTextTrack();

    // Emit one default timeupdate event to update player with duration
    this.player.getDuration().then(duration => {
      const e = new CustomEvent('timeupdate', {
        detail: { duration: duration, seconds: 0, percent: 0 }
      });

      this.el.dispatchEvent(e);
    })

    // As controls are disabled we do not want the iframe to be
    // focusable by tabbing
    // @ts-ignore
    this.player.element.tabIndex = -1;

    // Read aspect ratio from video to configure view box
    this.ratio = await this.getAspectRatio();

    // This event indicates the video component is loaded and ready
    this.el.dispatchEvent(new CustomEvent('ready'));
  }

  async componentDidUnload() {
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

  @Method()
  async setPlaybackRate(playbackRate: number) {
    return this.player.setPlaybackRate(playbackRate);
  }

}
