import {
  Component,
  Element,
  h,
  Prop,
  EventEmitter,
  Event,
  Listen,
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
import { Mode, Status } from '../../utils/status';
import { bind } from '../../utils/bind';
import { TextTrackList } from '../../utils/webVTT';
import { PlaybackRateToggleButton, PlaybackRate } from './setting-elements';
import { ToggleControlProps } from '../../utils/types';

const KeyValues = {
  Space: ' ',
  Enter: 'Enter',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  f: 'f',
  m: 'm',
};

@Component({
  tag: 'xm-controls',
  styleUrl: 'controls.scss',
  shadow: true,
})
export class Controls {
  /**
   * Used on key control to skip forwards and backwards
   */
  skippedSeconds = 5;

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
        <Slider
          status={this.status}
          onSeek={this._seek}
          onKeyDown={this.togglePlay}
        />
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
  @Listen('keydown', { target: 'parent' })
  private handleKeyDown(e: KeyboardEvent) {
    const key = e.key;
    const target = e.target as Element;

    if (this.hasDefaultScrollingBehavior(key, target)) {
      // Prevent default scrolling when focusing the player and pressing "Space" or "ArrowUp" / "ArrowDown"
      e.preventDefault();
    }

    switch (key) {
      case KeyValues.Space:
      case KeyValues.Enter:
        // Prevent interference with controls from <xm-controls>:
        // If focus is on a button from <xm-controls> the video should not play/pause.
        // Instead, the button functionality will be triggered.
        if (target.tagName === 'XM-CONTROLS') return;
        this.togglePlay();
        break;
      case KeyValues.ArrowUp:
        this.increaseVolume();
        break;
      case KeyValues.ArrowDown:
        this.decreaseVolume();
        break;
      case KeyValues.ArrowLeft:
        this.skipBackward();
        break;
      case KeyValues.ArrowRight:
        this.skipForward();
        break;
      case KeyValues.f:
        this.toggleFullscreen();
        break;
      case KeyValues.m:
        this.toggleMute();
        break;
    }
  }

  @bind()
  @Listen('dblclick', { target: 'parent' })
  private handleDoubleClick(e: MouseEvent) {
    this.toggleFullscreen();
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

  @bind()
  private toggleFullscreen() {
    this.status.fullscreen ? this._exitFullscreen() : this._enterFullscreen();
  }

  @bind()
  private toggleMute() {
    this.status.muted ? this._unmute() : this._mute();
  }

  @bind()
  private togglePlay() {
    if (this.status.mode === Mode.PAUSED) {
      this._play();
    }
    if (this.status.mode === Mode.PLAYING) {
      this._pause();
    }
  }

  @bind()
  private increaseVolume() {
    let volume = this.fixDecimalPrecision(this.status.volume);

    if (volume < 1) {
      this._setVolume((volume += 0.1));
    }
  }

  @bind()
  private decreaseVolume() {
    let volume = this.fixDecimalPrecision(this.status.volume);

    if (volume > 0) {
      this._setVolume((volume -= 0.1));
    }
  }

  @bind()
  private skipForward() {
    const progress = this.status.progress.seconds;
    const endOfVideo = this.status.duration;
    const newPosition =
      progress < endOfVideo - this.skippedSeconds
        ? progress + this.skippedSeconds
        : endOfVideo;

    this._seek(newPosition);
  }

  @bind()
  private skipBackward() {
    const progress = this.status.progress.seconds;
    const newPosition =
      progress < this.skippedSeconds ? 0 : progress - this.skippedSeconds;

    this._seek(newPosition);
  }

  private fixDecimalPrecision(number: number): number {
    return parseFloat(number.toFixed(1));
  }

  private hasDefaultScrollingBehavior(key: string, target: Element): boolean {
    return (
      (key === ' ' && target.tagName !== 'XM-CONTROLS') ||
      key === 'ArrowUp' ||
      key === 'ArrowDown'
    );
  }
}
