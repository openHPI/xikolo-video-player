import locales from './locales';

export enum SettingNames {
  PLAYBACKRATE = 'playbackRate',
  TEXTTRACK = 'textTrack',
}

export const textTrackDefault = 'off';

export interface Setting<T> {
  name: string;
  label: string;
  values: Array<T>;
  valueLabels?: Array<String>;
  currentValue: T;
}

export const settingList: Array<Setting<any>> = [
  {
    name: SettingNames.PLAYBACKRATE,
    label: locales.en.playbackRate,
    values: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    currentValue: 1,
  },
  {
    name: SettingNames.TEXTTRACK,
    label: locales.en.textTrack,
    values: [textTrackDefault],
    valueLabels: [locales.en.textTrackDefault],
    currentValue: textTrackDefault,
  },
];

export interface SettingsSubmenuStatus {
  isOpen: boolean;
  currentSetting: Setting<any>;
}

export const defaultSettingsSubmenuStatus: SettingsSubmenuStatus = {
  isOpen: false,
  currentSetting: null,
};
