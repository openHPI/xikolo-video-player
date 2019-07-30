import { h } from '@stencil/core';

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

export interface Status {
  duration: number;
  fullscreen: boolean;
  mode: Mode;
  progress: Progress;
}

export const defaultStatus: Status = {
  duration: 0,
  fullscreen: false,
  mode: Mode.PAUSED,
  progress: {
    seconds: 0,
    percent: 0,
  }
}
