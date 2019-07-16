import {
  Component,
  Element,
  Prop,
  State,
  h,
  Event,
  EventEmitter,
  Watch,
  Method,
} from '@stencil/core';

import { format } from '../../utils/duration';
import * as icon from '../../utils/icon';
import { Fullscreen, PlayPause } from './buttons';
import { StateManager } from '../../utils/state-manager';
import { Inject } from '../../utils/ioc';


@Component({
  tag: 'xm-controls',
  styleUrl: 'controls.scss',
  shadow: true
})
export class Controls {
  @Element() el: HTMLXmControlsElement;

  @Inject()
  public stateManager: StateManager;

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
        <PlayPause playing={this.playing} onPlay={() => this.evPlay.emit()} onPause={() => this.evPause.emit()} />
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

  connectedCallback() {
    console.log(this.stateManager);
  }

  private seek(e: Event) {
    const el = e.srcElement as HTMLInputElement;
    const value = parseFloat(el.value);

    console.log(value);
  }
}
