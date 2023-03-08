import { Cue } from './webVTT';
import { textTrackDefault } from './settings';
import { KnownLocale } from './locales';

export enum Mode {
  PLAYING,
  PAUSED,
  BUFFERING,
  FINISHED,
}

export interface Progress {
  seconds: number;
  percent: number;
}

export interface Subtitle {
  enabled: boolean;
  language: string;
  activeCues: Array<Cue>;
}

export interface Settings {
  playbackRate: number;
  textTrack: string;
}

export interface Status {
  language: KnownLocale;
  duration: number;
  volume: number;
  muted: boolean;
  fullscreen: boolean;
  mode: Mode;
  openedSettingsMenu: boolean;
  showPlaybackRate: boolean;
  progress: Progress;
  subtitle: Subtitle;
  settings: Settings;
  loading: boolean;
}

export const defaultStatus: Status = {
  language: 'en',
  duration: null,
  volume: 1.0,
  muted: false,
  fullscreen: false,
  mode: Mode.PAUSED,
  openedSettingsMenu: false,
  showPlaybackRate: false,
  progress: {
    seconds: 0,
    percent: 0,
  },
  subtitle: {
    enabled: false,
    language: null,
    activeCues: null,
  },
  settings: {
    playbackRate: 1,
    textTrack: textTrackDefault,
  },
  loading: true,
};
