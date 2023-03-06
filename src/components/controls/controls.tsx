import {
  Component,
  Element,
  h,
  Prop,
  EventEmitter,
  Event,
} from '@stencil/core';
import {
  Fullscreen,
  Control,
  CurrentTime,
  Volume,
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

  /**
   * Player status
   */
  @Prop({ mutable: true }) status: Status;

  /**
   * List of text tracks
   */
  @Prop({ mutable: true }) textTracks: TextTrackList;

  /**
   * JSON encoded sources for slides
   */
  @Prop() slidesSrc?: string;

  /**
   * Array of toggle control configurations
   */
  @Prop({ mutable: true }) toggleControlButtons: Array<ToggleControlProps>;

  /**
   * Emitted on play
   */
  @Event({ eventName: 'control:play' }) playEvent: EventEmitter;

  /**
   * Emitted on pause
   */
  @Event({ eventName: 'control:pause' }) pauseEvent: EventEmitter;

  /**
   * Emitted when the full screen is entered
   */
  @Event({ eventName: 'control:enterFullscreen' })
  enterFullscreenEvent: EventEmitter;

  /**
   * Emitted when the full screen is exited
   */
  @Event({ eventName: 'control:exitFullscreen' })
  exitFullscreenEvent: EventEmitter;

  /**
   * Emitted when volume is muted
   */
  @Event({ eventName: 'control:mute' }) muteEvent: EventEmitter;

  /**
   * Emitted when volume is unmuted
   */
  @Event({ eventName: 'control:unmute' }) unmuteEvent: EventEmitter;

  /**
   * Emitted when the volume is changed
   */
  @Event({ eventName: 'control:changeVolume' }) changeVolumeEvent: EventEmitter;

  /**
   * Emitted when the text track is enabled
   */
  @Event({ eventName: 'control:enableTextTrack' })
  enableTextTrackEvent: EventEmitter;

  /**
   * Emitted when the text track is disabled
   */
  @Event({ eventName: 'control:disableTextTrack' })
  disableTextTrackEvent: EventEmitter;

  /**
   * Emitted when the settings menu is opened
   */
  @Event({ eventName: 'control:openSettingsMenu' })
  openSettingsMenuEvent: EventEmitter;

  /**
   * Emitted when the settings menu is closed
   */
  @Event({ eventName: 'control:closeSettingsMenu' })
  closeSettingsMenuEvent: EventEmitter;

  /**
   * Emitted when the playback rate is changed
   */
  @Event({ eventName: 'control:changePlaybackRate' })
  changePlaybackRateEvent: EventEmitter;

  /**
   * Emitted when the playback rate menu is opened
   */
  @Event({ eventName: 'control:showPlaybackRate' })
  showPlaybackRateEvent: EventEmitter;

  /**
   * Emitted when the playback rate menu is closed
   */
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
        <xm-slider
          duration={this.status.duration}
          progress={this.status.progress}
          slidesSrc={this.slidesSrc}
        />
        <div class="controls__toolbar" data-test-id="controlsToolbar">
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
            data-test-id="settingsMenuToggleButton"
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
  private _mute() {
    this.muteEvent.emit();
  }

  @bind()
  private _unmute() {
    this.unmuteEvent.emit();
  }

  @bind()
  private _setVolume(volume: number) {
    this.changeVolumeEvent.emit({ volume });
  }

  @bind()
  private _openSettingsMenu(e: Event) {
    e.stopPropagation();
    this.hidePlaybackRateEvent.emit();
    this.openSettingsMenuEvent.emit();
  }

  @bind()
  private _closeSettingsMenu(e: Event) {
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
    this.changePlaybackRateEvent.emit({ playbackRate });
    this.hidePlaybackRateEvent.emit();
  }

  @bind()
  private _showPlaybackRate(e: Event) {
    e.stopPropagation();
    this.closeSettingsMenuEvent.emit();
    this.showPlaybackRateEvent.emit();
  }

  @bind()
  private _hidePlaybackRate(e: Event) {
    e.stopPropagation();
    this.hidePlaybackRateEvent.emit();
  }

  @bind()
  private _changeToggleControlActiveState(button: ToggleControlProps) {
    button.active = !button.active;
    this.changeToggleControlActiveStateEvent.emit(button);
  }
}
