import { Component, Element, h, Prop, EventEmitter, Event, State } from '@stencil/core';

import { Fullscreen, Control, CurrentTime, Volume, Slider, SettingsMenuToggleButton, Subtitles, SubtitleButton } from './elements';
import { Status } from '../../utils/status';
import { bind } from '../../utils/bind';
import { TextTrack } from '../../utils/webVTT';

@Component({
  tag: 'xm-controls',
  styleUrl: 'controls.scss',
  shadow: true
})
export class Controls {
  @Element() el: HTMLXmControlsElement;

  @Prop() status: Status;
  @Prop({mutable: true}) textTrack: TextTrack;

  @State()
  private openedSettingsMenu: boolean = false;

  @Event({eventName: 'control:play'}) playEvent: EventEmitter;
  @Event({eventName: 'control:pause'}) pauseEvent: EventEmitter;
  @Event({eventName: 'control:seek'}) seekEvent: EventEmitter;
  @Event({eventName: 'control:enterFullscreen'}) enterFullscreenEvent: EventEmitter;
  @Event({eventName: 'control:exitFullscreen'}) exitFullscreenEvent: EventEmitter;
  @Event({eventName: 'control:mute'}) muteEvent: EventEmitter;
  @Event({eventName: 'control:unmute'}) unmuteEvent: EventEmitter;
  @Event({eventName: 'control:changeVolume'}) changeVolumeEvent: EventEmitter;
  @Event({eventName: 'control:enableTextTrack'}) enableTextTrackEvent: EventEmitter;
  @Event({eventName: 'control:disableTextTrack'}) disableTextTrackEvent: EventEmitter;

  public render() {
    return (
      <div class="controls">
        <Subtitles status={this.status} />
        <xm-settings-menu status={this.status} isOpen={this.openedSettingsMenu} textTrack={this.textTrack} />
        <Slider status={this.status} onSeek={this._seek} />
        <div class="controls__toolbar">
          <Control status={this.status} onPause={this._pause} onPlay={this._play} />
          <Volume status={this.status} onMute={this._mute} onUnmute={this._unmute} onChangeVolume={this._setVolume} />
          <CurrentTime status={this.status} />
          <SubtitleButton status={this.status} visible={!!this.status.subtitle.language} onEnable={this._enableTextTrack} onDisable={this._disableTextTrack} />
          <SettingsMenuToggleButton
            status={this.status}
            openedSettingsMenu={this.openedSettingsMenu}
            onOpenSettingsMenu={this._openSettingsMenu}
            onCloseSettingsMenu={this._closeSettingsMenu}
          />
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

  @bind()
  private _mute() {
    this.muteEvent.emit();
  }

  @bind()
  private _unmute() {
    this.unmuteEvent.emit();
  }

  @bind()
  private _setVolume(volume: number) {
    this.changeVolumeEvent.emit({volume: volume})
  }

  @bind()
  private _openSettingsMenu() {
    this.openedSettingsMenu = true;
  }

  @bind()
  private _closeSettingsMenu() {
    this.openedSettingsMenu = false;
  }


  @bind()
  private _enableTextTrack() {
    this.enableTextTrackEvent.emit();
  }

  @bind()
  private _disableTextTrack() {
    this.disableTextTrackEvent.emit();
  }
}
