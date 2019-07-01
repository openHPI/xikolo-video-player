import {
  Component,
  Element,
  Prop,
  State,
  h,
  Event,
  EventEmitter,
} from '@stencil/core';

import { format } from '../../utils/duration';
import * as icon from '../../utils/icon';

@Component({
  tag: 'xim-player-controls',
  styleUrl: 'player-controls.scss',
  shadow: true
})
export class VideoPlayer {
  @Element() el: HTMLElement;

  @Prop({ connect: 'state-manager' }) stateManager: any;

  @State() playing: boolean;
  @State() fullscreen: boolean;
  @State() pip: boolean;

  @State() seconds: number = 0;
  @State() duration: number = 0;

  @Event({ eventName: 'play' }) evPlay: EventEmitter;
  @Event({ eventName: 'pause' }) evPause: EventEmitter;

  render() {
    return (
      <div class="controls">
        <input class="controls__slider"
          part="slider"
          type="range"
          min="0"
          max={this.duration}
          step="any"
          autocomplete="off"
          value={this.seconds}
          onInput={e => this.seek(e)}
        />
        <div class="controls__toolbar">
          {this.playing
            ? <button onClick={() => this.evPause.emit()} title="Pause" innerHTML={icon.Pause} />
            : <button onClick={() => this.evPlay.emit()} title="Play" innerHTML={icon.Play} />
          }
          <span class="controls__time" title={`Time left of ${format(this.duration)}s`}>
            -{format(this.duration - this.seconds)}
          </span>
          {this.pip
            ? <button onClick={() => this.pip = false} innerHTML={icon.Columns} />
            : <button onClick={() => this.pip = true} innerHTML={icon.Clone} />
          }
          {/* {this.fullscreen
            ? <button onClick={() => this._exitFullscreen()} innerHTML={icon.Compress} />
            : <button onClick={() => this._requestFullscreen()} innerHTML={icon.Expand} />
          } */}
        </div>
      </div>
    );
  }

  private seek(e: Event) {
    const el = e.srcElement as HTMLInputElement;
    const value = parseFloat(el.value);

    console.log(value);

    // let [seconds] = await Promise.all([
    //   this.source.setCurrentTime(value),
    //   this.secondary.setCurrentTime(value)
    // ]);

    // this.seconds = seconds;

    // return this.playing ? this.play() : this.pause()
    // this.evPlay.emit()
  }
}
