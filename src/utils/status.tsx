import { h } from '@stencil/core';

export enum Mode {
  PLAYING,
  PAUSED,
  BUFFERING,
  FINISHED,
}

export interface Settings {
  playbackRate: number;
}

export interface Progress {
  seconds: number;
  percent: number;
}

export interface Status {
  duration: number;
  fullscreen: boolean;
  mode: Mode;
  progress: Progress;
  muted: boolean;
  volume: number;
  settings: Settings;
}

export const defaultStatus: Status = {
  duration: 0,
  volume: 1.0,
  muted: false,
  fullscreen: false,
  mode: Mode.PAUSED,
  progress: {
    seconds: 0,
    percent: 0,
  },
  settings: {
    playbackRate: 1,
  }
}
