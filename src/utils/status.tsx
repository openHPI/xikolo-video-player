import { Cue } from './webVTT';
import { textTrackDefault } from './settings';

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
  language: string;
  duration: number;
  fullscreen: boolean;
  mode: Mode;
  progress: Progress;
  muted: boolean;
  volume: number;
  subtitle: Subtitle;
  settings: Settings;
}

export const defaultStatus: Status = {
  language: 'en',
  duration: 0,
  volume: 1.0,
  muted: false,
  fullscreen: false,
  mode: Mode.PAUSED,
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
  }
}
