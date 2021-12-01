import { FunctionalComponent, h } from '@stencil/core';

import * as icon from '../../utils/icon';
import { Status } from '../../utils/status';
import locales from '../../utils/locales';
import { SettingNames, settingList } from '../../utils/settings';

interface PlaybackRateToggleButtonProps {
  status: Status;
  onShow: (e: Event) => void;
  onHide: (e: Event) => void;
}

export const PlaybackRateToggleButton: FunctionalComponent<
  PlaybackRateToggleButtonProps
> = (props) => {
  if (props.status.showPlaybackRate) {
    return (
      <button
        onClick={props.onHide}
        title={locales[props.status.language].playbackRate}
        aria-label={locales[props.status.language].playbackRate}
      >
        <span
          class="controls__button-icon controls__button-icon--active svg"
          innerHTML={icon.Speed}
        />
      </button>
    );
  }
  return (
    <button
      onClick={props.onShow}
      title={locales[props.status.language].playbackRate}
      aria-label={locales[props.status.language].playbackRate}
    >
      <span class="controls__button-icon svg" innerHTML={icon.Speed} />
    </button>
  );
};

interface PlaybackRateProps {
  status: Status;
  onChange: (playbackrate: number) => void;
}

export const PlaybackRate: FunctionalComponent<PlaybackRateProps> = (props) => {
  const playbackRateSetting = settingList.find(
    (setting) => setting.name === SettingNames.PLAYBACKRATE
  );
  playbackRateSetting.currentValue =
    props.status.settings[SettingNames.PLAYBACKRATE];
  return (
    <div
      class={
        props.status.showPlaybackRate
          ? 'controls__playback-rate__menu controls__playback-rate__menu--open'
          : 'controls__playback-rate__menu'
      }
    >
      {playbackRateSetting.values.map((value) => (
        <button
          class={
            value === playbackRateSetting.currentValue
              ? 'controls__playback-rate__button controls__playback-rate__button--current'
              : 'controls__playback-rate__button'
          }
          onClick={() => props.onChange(value)}
          innerHTML={value}
        />
      ))}
    </div>
  );
};
