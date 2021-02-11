import {
  Component,
  Element,
  h,
  Prop,
  EventEmitter,
  Event,
  State,
} from '@stencil/core';
import {
  Fullscreen,
  Control,
  CurrentTime,
  Volume,
  Slider,
  SettingsMenuToggleButton,
  Subtitles,
  SubtitleButton,
  CustomControlButton,
} from './elements';
import { Status } from '../../utils/status';
import { bind } from '../../utils/bind';
import { TextTrackList } from '../../utils/webVTT';
import { PlaybackRateToggleButton, PlaybackRate } from './setting-elements';
import { ToggleControlProps } from '../../utils/types';

@Component({
  tag: 'xm-controls',
  styleUrl: 'controls.scss',
  shadow: true,
})
export class Controls {
  @Element() el: HTMLXmControlsElement;

  @Prop() status: Status;
  @Prop({ mutable: true }) textTracks: TextTrackList;
  @Prop({ mutable: true }) toggleControlButtons: Array<ToggleControlProps>;

  @Event({ eventName: 'control:play' }) playEvent: EventEmitter;
  @Event({ eventName: 'control:pause' }) pauseEvent: EventEmitter;
  @Event({ eventName: 'control:seek' }) seekEvent: EventEmitter;
  @Event({ eventName: 'control:enterFullscreen' })
  enterFullscreenEvent: EventEmitter;
  @Event({ eventName: 'control:exitFullscreen' })
  exitFullscreenEvent: EventEmitter;
  @Event({ eventName: 'control:mute' }) muteEvent: EventEmitter;
  @Event({ eventName: 'control:unmute' }) unmuteEvent: EventEmitter;
  @Event({ eventName: 'control:changeVolume' }) changeVolumeEvent: EventEmitter;
  @Event({ eventName: 'control:enableTextTrack' })
  enableTextTrackEvent: EventEmitter;
  @Event({ eventName: 'control:disableTextTrack' })
  disableTextTrackEvent: EventEmitter;
  @Event({ eventName: 'control:openSettingsMenu' })
  openSettingsMenuEvent: EventEmitter;
  @Event({ eventName: 'control:closeSettingsMenu' })
  closeSettingsMenuEvent: EventEmitter;
  @Event({ eventName: 'control:changePlaybackRate' })
  changePlaybackRateEvent: EventEmitter;
  @Event({ eventName: 'control:showPlaybackRate' })
  showPlaybackRateEvent: EventEmitter;
  @Event({ eventName: 'control:hidePlaybackRate' })
  hidePlaybackRateEvent: EventEmitter;
  /**
   * Event hook for custom control
   */
  @Event({ eventName: 'control:changeToggleControlActiveState' })
  changeToggleControlActiveStateEvent: EventEmitter<ToggleControlProps>;

  public render() {
    return (
      <div
        class={
          this.status.fullscreen
            ? 'controls controls--fullscreen-mode'
            : 'controls'
        }
      >
        <Subtitles status={this.status} />
        <xm-settings-menu status={this.status} textTracks={this.textTracks} />
        <Slider status={this.status} onSeek={this._seek} />
        <div class="controls__toolbar">
          <Control
            status={this.status}
            onPause={this._pause}
            onPlay={this._play}
          />
          <Volume
            status={this.status}
            onMute={this._mute}
            onUnmute={this._unmute}
            onChangeVolume={this._setVolume}
          />
          <CurrentTime status={this.status} />
          <div class="controls__playback-rate">
            <PlaybackRate
              status={this.status}
              onChange={this._setPlaybackRate}
            />
            <PlaybackRateToggleButton
              status={this.status}
              onShow={this._showPlaybackRate}
              onHide={this._hidePlaybackRate}
            />
          </div>

          {this.toggleControlButtons &&
            this.toggleControlButtons.map((button) => (
              <CustomControlButton
                config={button}
                onClick={this._changeToggleControlActiveState}
              ></CustomControlButton>
            ))}

          <SubtitleButton
            status={this.status}
            visible={!!this.status.subtitle.language}
            onEnable={this._enableTextTrack}
            onDisable={this._disableTextTrack}
          />
          <SettingsMenuToggleButton
            status={this.status}
            onOpenSettingsMenu={this._openSettingsMenu}
            onCloseSettingsMenu={this._closeSettingsMenu}
          />
          <Fullscreen
            status={this.status}
            onRequest={this._enterFullscreen}
            onExit={this._exitFullscreen}
          />
        </div>
      </div>
    );
  }

  @bind()
  private _play() {
    this.playEvent.emit();
  }

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
    this.seekEvent.emit({ seconds: seconds });
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
    this.changeVolumeEvent.emit({ volume: volume });
  }

  @bind()
  private _openSettingsMenu(e: MouseEvent) {
    e.stopPropagation();
    this.hidePlaybackRateEvent.emit();
    this.openSettingsMenuEvent.emit();
  }

  @bind()
  private _closeSettingsMenu(e: MouseEvent) {
    e.stopPropagation();
    this.closeSettingsMenuEvent.emit();
  }

  @bind()
  private _enableTextTrack() {
    this.enableTextTrackEvent.emit();
  }

  @bind()
  private _disableTextTrack() {
    this.disableTextTrackEvent.emit();
  }

  @bind()
  private _setPlaybackRate(playbackRate: number) {
    this.changePlaybackRateEvent.emit({ playbackRate: playbackRate });
    this.hidePlaybackRateEvent.emit();
  }

  @bind()
  private _showPlaybackRate(e: MouseEvent) {
    e.stopPropagation();
    this.closeSettingsMenuEvent.emit();
    this.showPlaybackRateEvent.emit();
  }

  @bind()
  private _hidePlaybackRate(e: MouseEvent) {
    e.stopPropagation();
    this.hidePlaybackRateEvent.emit();
  }

  @bind()
  private _changeToggleControlActiveState(button: ToggleControlProps) {
    button.active = !button.active;
    this.changeToggleControlActiveStateEvent.emit(button);
  }
}
