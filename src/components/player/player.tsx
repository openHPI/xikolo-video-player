import {
  Component,
  Element,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

@Component({
  tag: 'xim-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element() el: HTMLElement;

  @Prop() src: string;

  private source: any;
  private secondary: any;

  @State() playing: boolean;
  @State() fullscreen: boolean;
  @State() pip: boolean;

  @State() seconds: number = 0;
  @State() duration: number = 0;

  render() {
    let cl = {
      'player': true,
      'fullscreen': this.fullscreen
    };

    return (
      <div class={cl}>
        <xim-screen pip={this.pip}>
          <xim-video
            src={340196868}
            ref={(e) => this.source = e}
            onClick={(e) => this.handleOverlayClick(e)}>
          </xim-video>
          <xim-video
            slot="secondary"
            src={340196788}
            ref={(e) => this.secondary = e}
            onClick={(e) => this.handleOverlayClick(e)}>
          </xim-video>
        </xim-screen>
        <xim-player-controls />
      </div>
    );
  }

  @Method()
  async play() {
    await Promise.all([
      this.source.play(),
      this.secondary.play()
    ])

    this.playing = true;
  }

  @Method()
  async pause() {
    await Promise.all([
      this.source.pause(),
      this.secondary.pause()
    ]);

    this.playing = false;
  }

  @Method()
  async _requestFullscreen() {
    this.el.requestFullscreen();
    this.fullscreen = true;
  }

  @Method()
  async _exitFullscreen() {
    document.exitFullscreen();
    this.fullscreen = false;
  }

  async handleSliderChange(e: Event) {
    const el = e.srcElement as HTMLInputElement;
    const value = parseFloat(el.value);

    let [seconds] = await Promise.all([
      this.source.setCurrentTime(value),
      this.secondary.setCurrentTime(value)
    ]);

    this.seconds = seconds;

    return this.playing ? this.play() : this.pause()
  }

  async componentDidLoad() {
    this.duration = await this.source.getDuration();

    // this.source.addEventListener('play', () => {
    //   this.playing = true;
    // })

    // this.source.addEventListener('pause', () => {
    //   this.playing = false;
    // })

    this.source.addEventListener('timeupdate', (e: CustomEvent) => {
      this.seconds = e.detail.seconds;
      this.duration = e.detail.duration;
    })
  }

  private handleOverlayClick(_: MouseEvent) {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
}
