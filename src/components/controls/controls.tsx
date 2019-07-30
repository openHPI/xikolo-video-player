import {
  Component,
  Element,
  State,
  h,
  Event,
  EventEmitter,
} from '@stencil/core';

import { format } from '../../utils/duration';
import * as icon from '../../utils/icon';
import { Fullscreen, PlayPause } from './buttons';


@Component({
  tag: 'xm-controls',
  styleUrl: 'controls.scss',
  shadow: true
})
export class Controls {
  @Element() el: HTMLXmControlsElement;

  @State() playing: boolean;
  @State() fullscreen: boolean;
  @State() pip: boolean;

  @State() seconds: number = 0;
  @State() duration: number = 0;

  @Event({ eventName: 'control:play' }) evPlay: EventEmitter;
  @Event({ eventName: 'control:pause' }) evPause: EventEmitter;

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
          <PlayPause playing={false} onPlay={this.play.bind(this)} onPause={this.pause.bind(this)} />
          <span class="controls__time" title={`Time left of ${format(this.duration)}s`}>
            -{format(this.duration - this.seconds)}
          </span>
          {this.pip
            ? <button onClick={() => this.pip = false} innerHTML={icon.Columns} />
            : <button onClick={() => this.pip = true} innerHTML={icon.Clone} />
          }
          <Fullscreen fullscreen={false} onRequest={() => null} onExit={() => null} />
        </div>
      </div>
    );
  }

  private play(e: MouseEvent) {
    this.evPlay.emit();
  }

  private pause(e: MouseEvent) {
    this.evPause.emit();
  }

  private seek(e: Event) {
    const el = e.srcElement as HTMLInputElement;
    const value = parseFloat(el.value);

    console.log(value);
  }
}
