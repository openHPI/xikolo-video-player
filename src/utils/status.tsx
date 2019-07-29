import { h } from '@stencil/core';

import { createProviderConsumer } from '@stencil/state-tunnel';

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

const defaultState: PlayerState = {
  mode: Mode.PAUSED,
  fullscreen: false,
};

export default createProviderConsumer<PlayerState>(
  defaultState,
  (subscribe, child) => {
    return (<context-consumer subscribe={subscribe} renderer={child} />);
  }
);
