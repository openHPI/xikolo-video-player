export enum SettingNames {
  PLAYBACKRATE = 'playbackRate',
  TEXTTRACK = 'textTrack',
}

export const textTrackDefault = 'off';

export interface Setting {
  name: string;
  label: string;
  values: any;
  valueLabels?: Array<String>;
  currentValue: any;
}

export const settingList: Array<Setting> = [
  {
    name: SettingNames.PLAYBACKRATE,
    label: 'Wiedergabegeschwindigkeit',
    values: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    currentValue: 1,
  }, {
    name: SettingNames.TEXTTRACK,
    label: 'Untertitel',
    values: [textTrackDefault],
    valueLabels: ['aus'],
    currentValue: textTrackDefault,
  },
];

export interface SettingsSubmenuStatus {
  isOpen: boolean;
  currentSetting: Setting;
}

export const defaultSettingsSubmenuStatus: SettingsSubmenuStatus = {
  isOpen: false,
  currentSetting: null,
}
