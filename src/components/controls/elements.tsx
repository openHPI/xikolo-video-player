import { FunctionalComponent, h } from '@stencil/core';

import * as icon from '../../utils/icon';
import { Status, Mode, Subtitle } from '../../utils/status';
import { format } from '../../utils/duration';
import locales from '../../utils/locales';


interface FullscreenProps {
  status: Status;
  onRequest: (e: Event) => void;
  onExit: (e: Event) => void;
}

export const Fullscreen: FunctionalComponent<FullscreenProps> = props => {
  if(props.status.fullscreen) {
    return <button onClick={props.onExit} innerHTML={icon.Compress} title={locales[props.status.language].exitFullscreen} />
  } else {
    return <button onClick={props.onRequest} innerHTML={icon.Expand} title={locales[props.status.language].enterFullscreen} />
  }
}


interface ControlProps {
  status: Status;
  onPlay: (e: Event) => void;
  onPause: (e: Event) => void;
}

export const Control: FunctionalComponent<ControlProps> = props => {
  if(props.status.mode === Mode.PLAYING) {
    return <button onClick={props.onPause} innerHTML={icon.Pause} title={locales[props.status.language].pause} />
  } else if(props.status.mode === Mode.FINISHED) {
    return <button onClick={props.onPlay} innerHTML={icon.Restart} title={locales[props.status.language].restart} />
  } else {
    return <button onClick={props.onPlay} innerHTML={icon.Play} title={locales[props.status.language].play} />
  }
}


interface CurrentTimeProps {
  status: Status
}

export const CurrentTime: FunctionalComponent<CurrentTimeProps> = props => {
  const { duration, progress } = props.status;

  return (
    <span class="controls__time" title={`Time left of ${format(duration)}s`}>
      -{format(duration - progress.seconds)}
    </span>
  );
}

interface VolumeProps {
  status: Status;
  onMute: (e: Event) => void;
  onUnmute: (e: Event) => void;
  onChangeVolume: (volume: number) => void;
}

export const Volume: FunctionalComponent<VolumeProps> = props => {
  const { muted, volume } = props.status;

  const fnSetVolume = (e: Event) => {
    const el = e.target as HTMLInputElement;
    props.onChangeVolume(parseFloat(el.value));
  };

  const volumeSlider = (
    <input class="controls__slider controls__slider--volume"
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      onInput={fnSetVolume}
/>);

  if(muted) {
    return (
      <div class="controls-volume">
        <button class="controls__unmute" onClick={props.onUnmute} innerHTML={icon.VolumeOff} title={locales[props.status.language].unmute} />
        {volumeSlider}
      </div>
    )
  } else {
    return (
      <div class="controls-volume">
        <button class="controls__mute" onClick={props.onMute} innerHTML={icon.VolumeOn} title={locales[props.status.language].mute}/>
        {volumeSlider}
      </div>
    )
  }
}

interface SliderProps {
  status: Status;
  onSeek: (seconds: number) => void;
}

export const Slider: FunctionalComponent<SliderProps> = props => {
  const { duration, progress } = props.status;

  const fnSeek = (e: Event) => {
    const el = e.target as HTMLInputElement;
    props.onSeek(parseFloat(el.value));
  };

  return (
    <input class="controls__slider"
      part="slider"
      type="range"
      min="0"
      max={duration}
      step="any"
      autocomplete="off"
      // Convert to string as zero (0) is otherwise ignored and
      // not rendered at all. This would show a default progress
      // bar of around 50%.
      value={progress.seconds.toString()}
      onInput={fnSeek}
    />
  );
}

interface SettingsMenuToggleButtonProps {
  status: Status;
  onOpenSettingsMenu: (e: Event) => void;
  onCloseSettingsMenu: (e: Event) => void;
}

export const SettingsMenuToggleButton: FunctionalComponent<SettingsMenuToggleButtonProps> = props => {
  if(props.status.openedSettingsMenu) {
    return (
      <button onClick={props.onCloseSettingsMenu} title={locales[props.status.language].settings}>
        <span class="controls__settings-icon controls__settings-icon--open" innerHTML={icon.Settings} />
      </button>
    )
  }
  return (
    <button onClick={props.onOpenSettingsMenu} title={locales[props.status.language].settings}>
      <span class="controls__settings-icon" innerHTML={icon.Settings} />
    </button>
  )
}

interface SubtitleButtonProps {
  status: Status;
  visible: boolean;
  onEnable: (e: Event) => void;
  onDisable: (e: Event) => void;
}

export const SubtitleButton: FunctionalComponent<SubtitleButtonProps> = props => {
  if(!props.visible) return;
  if(props.status.subtitle.enabled) {
    return (
      <button onClick={props.onDisable} title={locales[props.status.language].disableSubtitles}>
        <span class="controls__subtitle-icon controls__subtitle-icon--active" innerHTML={icon.Subtitle} />
      </button>
    )
  } else {
    return (
      <button onClick={props.onEnable} title={locales[props.status.language].enableSubtitles}>
        <span class="controls__subtitle-icon" innerHTML={icon.Subtitle} />
      </button>
    )
  }
}

interface SubtitlesProps {
  status: Status;
}

export const Subtitles: FunctionalComponent<SubtitlesProps> = props => {
  const { enabled, activeCues } = props.status.subtitle;
  if(enabled && activeCues && activeCues.length) {
    return (
      <div class="controls__subtitle">
          {activeCues.map(cue => (
            <span class="controls__subtitle-row" innerHTML={cue.text} />
          ))}
      </div>
    );
  }
}
