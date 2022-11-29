import { FunctionalComponent, h } from '@stencil/core';

import * as icon from '../../utils/icon';
import { Status, Mode } from '../../utils/status';
import { format } from '../../utils/duration';
import locales from '../../utils/locales';
import { ToggleControlProps } from '../../utils/types';

interface FullscreenProps {
  status: Status;
  onRequest: (e: Event) => void;
  onExit: (e: Event) => void;
}

export const Fullscreen: FunctionalComponent<FullscreenProps> = (props) => {
  if (props.status.fullscreen) {
    return (
      <button
        onClick={props.onExit}
        title={locales[props.status.language].exitFullscreen}
        aria-label={locales[props.status.language].exitFullscreen}
      >
        <span class="svg" innerHTML={icon.Compress} />
      </button>
    );
  }
  return (
    <button
      onClick={props.onRequest}
      title={locales[props.status.language].enterFullscreen}
      aria-label={locales[props.status.language].enterFullscreen}
    >
      <span class="svg" innerHTML={icon.Expand} />
    </button>
  );
};

interface ControlProps {
  status: Status;
  onPlay: (e: Event) => void;
  onPause: (e: Event) => void;
}

export const Control: FunctionalComponent<ControlProps> = (props) => {
  if (props.status.mode === Mode.PLAYING) {
    return (
      <button
        onClick={props.onPause}
        title={locales[props.status.language].pause}
        aria-label={locales[props.status.language].pause}
      >
        <span class="svg" innerHTML={icon.Pause} />
      </button>
    );
  }
  if (props.status.mode === Mode.FINISHED) {
    return (
      <button
        onClick={props.onPlay}
        title={locales[props.status.language].restart}
        aria-label={locales[props.status.language].restart}
      >
        <span class="svg" innerHTML={icon.Restart} />
      </button>
    );
  }
  return (
    <button
      onClick={props.onPlay}
      title={locales[props.status.language].play}
      aria-label={locales[props.status.language].play}
    >
      <span class="svg" innerHTML={icon.Play} />
    </button>
  );
};

interface CurrentTimeProps {
  status: Status;
}

export const CurrentTime: FunctionalComponent<CurrentTimeProps> = (props) => {
  const { duration, progress } = props.status;

  return (
    <span class="controls__time" title={`Time left of ${format(duration)}s`}>
      {format(progress.seconds)} / {format(duration)}
    </span>
  );
};

interface VolumeProps {
  status: Status;
  onMute: (e: Event) => void;
  onUnmute: (e: Event) => void;
  onChangeVolume: (volume: number) => void;
}

export const Volume: FunctionalComponent<VolumeProps> = (props) => {
  const { muted, volume } = props.status;

  const fnSetVolume = (e: Event) => {
    const el = e.target as HTMLInputElement;
    props.onChangeVolume(parseFloat(el.value));
  };

  const volumeSlider = (
    <input
      class="controls__slider controls__slider--volume"
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={muted ? 0 : volume}
      onChange={fnSetVolume}
      onInput={fnSetVolume}
      aria-label={locales[props.status.language].changeVolume}
    />
  );

  if (muted) {
    return (
      <div class="controls-volume">
        <button
          class="controls__unmute"
          onClick={props.onUnmute}
          title={locales[props.status.language].unmute}
          aria-label={locales[props.status.language].unmute}
        >
          <span class="svg" innerHTML={icon.VolumeOff} />
        </button>
        {volumeSlider}
      </div>
    );
  }
  return (
    <div class="controls-volume">
      <button
        class="controls__mute"
        onClick={props.onMute}
        title={locales[props.status.language].mute}
        aria-label={locales[props.status.language].mute}
      >
        <span class="svg" innerHTML={icon.VolumeOn} />
      </button>
      {volumeSlider}
    </div>
  );
};

interface SettingsMenuToggleButtonProps {
  status: Status;
  onOpenSettingsMenu: (e: Event) => void;
  onCloseSettingsMenu: (e: Event) => void;
}

export const SettingsMenuToggleButton: FunctionalComponent<
  SettingsMenuToggleButtonProps
> = (props) => {
  if (props.status.openedSettingsMenu) {
    return (
      <button
        onClick={props.onCloseSettingsMenu}
        title={locales[props.status.language].settings}
        aria-label={locales[props.status.language].settings}
        aria-haspopup="true"
      >
        <span
          class="controls__settings-icon controls__settings-icon--open svg"
          innerHTML={icon.Settings}
        />
      </button>
    );
  }
  return (
    <button
      onClick={props.onOpenSettingsMenu}
      title={locales[props.status.language].settings}
      aria-label={locales[props.status.language].settings}
      aria-haspopup="true"
    >
      <span class="controls__settings-icon svg" innerHTML={icon.Settings} />
    </button>
  );
};

interface SubtitleButtonProps {
  status: Status;
  visible: boolean;
  onEnable: (e: Event) => void;
  onDisable: (e: Event) => void;
}

export const SubtitleButton: FunctionalComponent<SubtitleButtonProps> = (
  props
) => {
  if (!props.visible) return;
  if (props.status.subtitle.enabled) {
    return (
      <button
        class="controls__button"
        onClick={props.onDisable}
        title={locales[props.status.language].disableSubtitles}
        aria-label={locales[props.status.language].disableSubtitles}
      >
        <span
          class="controls__button-icon controls__button-icon--active svg"
          innerHTML={icon.Subtitle}
        />
      </button>
    );
  }
  return (
    <button
      class="controls__button"
      onClick={props.onEnable}
      title={locales[props.status.language].enableSubtitles}
      aria-label={locales[props.status.language].enableSubtitles}
    >
      <span class="controls__button-icon svg" innerHTML={icon.Subtitle} />
    </button>
  );
};

interface SubtitlesProps {
  status: Status;
}

export const Subtitles: FunctionalComponent<SubtitlesProps> = (props) => {
  const { enabled, activeCues } = props.status.subtitle;
  if (enabled && activeCues && activeCues.length) {
    return (
      <div class="controls__subtitle">
        {activeCues.map((cue) => (
          <span class="controls__subtitle-row" dir="auto">
            {cue.text}
          </span>
        ))}
      </div>
    );
  }
};

interface ICustomControlButton {
  config: ToggleControlProps;
  onClick: (e: ToggleControlProps) => void;
}

export const CustomControlButton: FunctionalComponent<ICustomControlButton> = (
  props
) => (
  <button
    class="controls__button"
    onClick={() => props.onClick(props.config)}
    title={props.config.title}
  >
    <span
      class={`controls__button-icon ${
        props.config.active ? 'controls__button-icon--active' : ''
      } svg`}
    >
      <slot name={props.config.name}></slot>
    </span>
  </button>
);
