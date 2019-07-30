import { h } from '@stencil/core';

export enum Mode {
  PLAYING,
  PAUSED,
  BUFFERING,
  FINISHED,
}

export interface PlayerState {
  mode: Mode,
  fullscreen: boolean,
}
