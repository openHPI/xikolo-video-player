import {
  Component,
  Element,
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
      <div style={ctStyle} ref={(el) => this.container = el} />
      <div class="overlay" style={ctStyle}><slot /></div>
    </div>;
  }

  @Method()
  async load(id: number) {
    if(!id) return;

    this.player = new Player(this.container, {
      id: id,
      // @ts-ignore Non-free pro-only oembed parameter not declared in public
      // types definition.
      controls: '0',
      // @ts-ignore
      autopause: '0'
    })

    // @ts-ignore
    this.player.element.tabIndex = -1;

    this.player.on('play', (e) => {
      this.el.dispatchEvent(new CustomEvent('play', {
        detail: e, bubbles: false, cancelable: false
      }))
    })

    this.player.on('pause', (e) => {
      this.el.dispatchEvent(new CustomEvent('pause', {
        detail: e//, bubbles: false, cancelable: false
      }))
    })

    this.player.on('timeupdate', (e) => {
      this.el.dispatchEvent(new CustomEvent('timeupdate', {
        detail: e//, bubbles: false, cancelable: false
      }))
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

  @Method()
  async setCurrentTime(seconds: number) {
    return this.player.setCurrentTime(seconds);
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
    this.observer = new ResizeObserver(() => {
      this.clientHeight = this.el.clientHeight;
    });

    this.observer.observe(this.el);

    return this.load(this.src);
  }

  componentDidUnload() {
    this.observer.disconnect();
  }
}
