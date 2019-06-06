import {
  Component,
  Element,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

import { format } from '../../utils/duration';
import * as icon from './icon';

@Component({
  tag: 'xmf-video-player',
  styleUrl: 'video-player.scss',
  shadow: true
})
export class VideoPlayer {
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
        <xmf-screen pip={this.pip}>
          <xmf-video
            src={340196868}
            ref={(e) => this.source = e}
            onClick={(e) => this.handleOverlayClick(e)}>
          </xmf-video>
          <xmf-video
            slot="secondary"
            src={340196788}
            ref={(e) => this.secondary = e}
            onClick={(e) => this.handleOverlayClick(e)}>
          </xmf-video>
        </xmf-screen>
        <div class="controls">
          <input class="controls__slider"
            part="slider"
            type="range"
            min="0"
            max={this.duration}
            step="any"
            autocomplete="off"
            value={this.seconds}
            onInput={e => this.handleSliderChange(e)}
          />
          <div class="controls__toolbar">
            {this.playing
              ? <button onClick={() => this.pause()} title="Pause" innerHTML={icon.Pause} />
              : <button onClick={() => this.play()} title="Play" innerHTML={icon.Play} />
            }
            <span class="controls__time" title={`Time left of ${format(this.duration)}s`}>
              -{format(this.duration - this.seconds)}
            </span>
            {this.pip
              ? <button onClick={() => this.pip = false} innerHTML={icon.Columns} />
              : <button onClick={() => this.pip = true} innerHTML={icon.Clone} />
            }
            {this.fullscreen
              ? <button onClick={() => this._exitFullscreen()} innerHTML={icon.Compress} />
              : <button onClick={() => this._requestFullscreen()} innerHTML={icon.Expand} />
            }
          </div>
        </div>
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
