import { Component, Element, h, Prop, EventEmitter, Event } from '@stencil/core';

import { Fullscreen, Control, CurrentTime, Slider } from './elements';
import { Status } from '../../utils/status';
import { bind } from '../../utils/bind';


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
  @Event({eventName: 'control:enterFullscreen'}) enterFullscreenEvent: EventEmitter;
  @Event({eventName: 'control:exitFullscreen'}) exitFullscreenEvent: EventEmitter;

  protected render() {
    return (
      <div class="controls">
        <Slider status={this.status} onSeek={this._seek} />
        <div class="controls__toolbar">
          <Control status={this.status} onPause={this._pause} onPlay={this._play} />
          <CurrentTime status={this.status} />
          <Fullscreen status={this.status} onRequest={this._enterFullscreen} onExit={this._exitFullscreen} />
        </div>
      </div>
    );
  }

  @bind()
  private _play() {
    this.playEvent.emit();
  };

  @bind()
  private _pause() {
    this.pauseEvent.emit();
  }

  @bind()
  private _enterFullscreen() {
    this.enterFullscreenEvent.emit();
  }

  @bind()
  private _exitFullscreen() {
    this.exitFullscreenEvent.emit();
  }

  @bind()
  private _seek(seconds: number) {
    this.seekEvent.emit({seconds: seconds});
  }
}
