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
  @Prop() status: Status;

  /**
   * List of text tracks
   */
  @Prop() textTracks: TextTrackList;

  /**
   * JSON encoded sources for slides
   */
  @Prop() slidesSrc?: string;

  /**
   * Array of toggle control configurations
   */
  @Prop() toggleControlButtons: Array<ToggleControlProps>;

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
            onPause={this.pause}
            onPlay={this.play}
          />
          <Volume
            status={this.status}
            onMute={this.mute}
            onUnmute={this.unmute}
            onChangeVolume={this.setVolume}
          />
          <CurrentTime status={this.status} />
          <div class="controls__playback-rate">
            <PlaybackRate
              status={this.status}
              onChange={this.setPlaybackRate}
            />
            <PlaybackRateToggleButton
              status={this.status}
              onShow={this.showPlaybackRate}
              onHide={this.hidePlaybackRate}
            />
          </div>

          {this.toggleControlButtons &&
            this.toggleControlButtons.map((button) => (
              <CustomControlButton
                config={button}
                onClick={this.changeToggleControlActiveState}
              ></CustomControlButton>
            ))}

          <SubtitleButton
            status={this.status}
            visible={!!this.status.subtitle.language}
            onEnable={this.enableTextTrack}
            onDisable={this.disableTextTrack}
          />
          <SettingsMenuToggleButton
            status={this.status}
            onOpenSettingsMenu={this.openSettingsMenu}
            onCloseSettingsMenu={this.closeSettingsMenu}
            data-test-id="settingsMenuToggleButton"
          />
          <Fullscreen
            status={this.status}
            onRequest={this.enterFullscreen}
            onExit={this.exitFullscreen}
          />
        </div>
      </div>
    );
  }

  @bind()
  private play() {
    this.playEvent.emit();
  }

  @bind()
  private pause() {
    this.pauseEvent.emit();
  }

  @bind()
  private enterFullscreen() {
    this.enterFullscreenEvent.emit();
  }

  @bind()
  private exitFullscreen() {
    this.exitFullscreenEvent.emit();
  }

  @bind()
  private mute() {
    this.muteEvent.emit();
  }

  @bind()
  private unmute() {
    this.unmuteEvent.emit();
  }

  @bind()
  private setVolume(volume: number) {
    this.changeVolumeEvent.emit({ volume });
  }

  @bind()
  private openSettingsMenu(e: Event) {
    e.stopPropagation();
    this.hidePlaybackRateEvent.emit();
    this.openSettingsMenuEvent.emit();
  }

  @bind()
  private closeSettingsMenu(e: Event) {
    e.stopPropagation();
    this.closeSettingsMenuEvent.emit();
  }

  @bind()
  private enableTextTrack() {
    this.enableTextTrackEvent.emit();
  }

  @bind()
  private disableTextTrack() {
    this.disableTextTrackEvent.emit();
  }

  @bind()
  private setPlaybackRate(playbackRate: number) {
    this.changePlaybackRateEvent.emit({ playbackRate });
    this.hidePlaybackRateEvent.emit();
  }

  @bind()
  private showPlaybackRate(e: Event) {
    e.stopPropagation();
    this.closeSettingsMenuEvent.emit();
    this.showPlaybackRateEvent.emit();
  }

  @bind()
  private hidePlaybackRate(e: Event) {
    e.stopPropagation();
    this.hidePlaybackRateEvent.emit();
  }

  @bind()
  private changeToggleControlActiveState(button: ToggleControlProps) {
    button.active = !button.active;
    this.changeToggleControlActiveStateEvent.emit(button);
  }
}
