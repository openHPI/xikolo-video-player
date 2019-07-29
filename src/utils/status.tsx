import { h } from '@stencil/core';

import { createProviderConsumer } from '@stencil/state-tunnel';

export enum Mode {
  PLAYING,
  PAUSED,
  BUFFERING,
  FINISHED,
}

export interface Status {
  mode: Mode,
  fullscreen: boolean,
}

const defaultState: Status = {
  mode: Mode.PAUSED,
  fullscreen: false,
};

export default createProviderConsumer<Status>(
  defaultState,
  (subscribe, child) => {
    return (<context-consumer subscribe={subscribe} renderer={child} />);
  }
);
