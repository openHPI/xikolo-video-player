import {
  Component,
  Element,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

import { format } from '../../utils/duration';
import * as icon from './icon.js';

@Component({
  tag: 'xmf-video-player',
  styleUrl: 'video-player.scss',
  shadow: true
})
export class VideoPlayer {
  @Element() el: HTMLElement;

  @Prop() src: string;

  private source: any;

  @State() playing: boolean;
  @State() fullscreen: boolean;

  @State() seconds: number = 0;
  @State() duration: number = 0;

  render() {
    let cl = {
      'player': true,
      'fullscreen': this.fullscreen
    };

    return (
      <div class={cl}>
        <div class="player__presentation">
          <xmf-video
            class="player__source"
            src={205404461}
            ref={(e) => this.source = e}>
          </xmf-video>
          <div
            class="player__overlay"
            onClick={(e) => this.handleOverlayClick(e)}
          />
        </div>
        <div class="controls">
          <input class="controls__slider"
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
            {this.fullscreen
              ? <button onClick={() => this._exitFullscreen()} innerHTML={icon.Shrink} />
              : <button onClick={() => this._requestFullscreen()} innerHTML={icon.Enlarge} />
            }
          </div>
        </div>
      </div>
    );
  }

  @Method()
  async play() {
    return await this.source.play();
  }

  @Method()
  async pause() {
    return await this.source.pause();
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

    this.seconds = await this.source.setCurrentTime(value)
    this.playing ? this.source.play() : this.source.pause()
  }

  async componentDidLoad() {
    this.duration = await this.source.getDuration();

    this.source.addEventListener('play', () => {
      this.playing = true;
    })

    this.source.addEventListener('pause', () => {
      this.playing = false;
    })

    this.source.addEventListener('timeupdate', (e) => {
      this.seconds = e.seconds;
      this.duration = e.duration;
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
