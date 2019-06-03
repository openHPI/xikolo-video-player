import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

import Player from '@vimeo/player';
import { ResizeObserver } from 'resize-observer';

@Component({
  tag: 'xmf-video',
  styleUrl: 'video.scss',
  shadow: true
})
export class Video {
  @Element() el: HTMLElement;
  @Prop() src: number;
  @Prop() type: string;
  @Prop() controls: boolean;

  @State() private ratio: number = 0.5625;
  @State() private clientHeight: number;

  @Event({
    eventName: 'play',
    bubbles: false,
    cancelable: false
  })
  private _playEvent: EventEmitter;

  private container: HTMLElement;
  private player: Player;
  private observer: ResizeObserver;

  render() {
    let outerStyle = {
      paddingBottom: `${this.ratio * 100}%`
    };

    let ctStyle = {
      height: `${this.clientHeight}px`
    };

    return <div class="outer" style={outerStyle}>
      <div ref={(el) => this.container = el} style={ctStyle} />
    </div>;
  }

  @Method()
  async load(id: number) {
    this.player = new Player(this.container, {
      id: id,
      // @ts-ignore Non-free pro-only oembed parameter not declared in public
      // types definition.
      controls: '0'
    })

    this.player.on('play', (e) => {
      this._playEvent.emit(e)
    })

    this.player.on('pause', (e) => {
      this.el.dispatchEvent(new CustomEvent('pause', e))
    })

    await this.player.ready();

    Promise.all([
      this.player.getVideoWidth(),
      this.player.getVideoHeight()
    ]).then((dimensions) => {
      this.setAspectRatio(dimensions[1] / dimensions[0]);
    })
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

  setAspectRatio(ratio: number) {
    this.ratio = ratio;

    if(this.el.clientHeight > 0) {
      this.clientHeight = this.el.clientHeight;
    } else {
      this.clientHeight = this.el.clientWidth * this.ratio;
    }
  }

  async componentDidLoad() {
    await this.load(this.src)

    this.observer = new ResizeObserver(() => {
      this.clientHeight = this.el.clientHeight;
    });

    this.observer.observe(this.el)
  }

  componentDidUnload() {
    this.observer.disconnect();
  }
}
