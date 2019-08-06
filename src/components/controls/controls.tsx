import { Component, Element, h, Prop, EventEmitter, Event } from '@stencil/core';

import { Fullscreen, Control, CurrentTime, Slider } from './elements';
import { Status } from '../../utils/status';


@Component({
  tag: 'xm-controls',
  styleUrl: 'controls.scss',
  shadow: true
})
export class Controls {
  @Element() el: HTMLXmControlsElement;

  @Prop() status: Status;

  @Event({eventName: 'control:play'}) playEvent: EventEmitter;
  @Event({eventName: 'control:pause'}) pauseEvent: EventEmitter;
  @Event({eventName: 'control:seek'}) seekEvent: EventEmitter;

  protected render() {
    return (
      <div class="controls">
        <Slider status={this.status} onSeek={(seconds) => this.seekEvent.emit({seconds: seconds})} />
        <div class="controls__toolbar">
          <Control status={this.status} onPause={this.pauseEvent.emit} onPlay={this.playEvent.emit} />
          <CurrentTime status={this.status} />
          <Fullscreen fullscreen={false} onRequest={() => null} onExit={() => null} />
        </div>
      </div>
    );
  }

  private seek(e: Event) {
    const el = e.srcElement as HTMLInputElement;
    const value = parseFloat(el.value);

    console.log(value);
  }
}
