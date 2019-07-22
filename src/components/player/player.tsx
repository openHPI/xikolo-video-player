import {
  Component,
  Element,
  h,
} from '@stencil/core';

import { StateManager } from '../../utils/state-manager';
import { Service } from '../../utils/ioc';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element() el: HTMLElement;

  @Service()
  private stateManager: StateManager = new StateManager();

  render() {
    return (
      <div class="player">
        <xm-screen>
          <slot name="primary"></slot>
          <slot slot="secondary" name="secondary"></slot>
        </xm-screen>
        <xm-controls />
      </div>
    );
  }

  componentDidLoad() {
    const primary = this.el.querySelector('[slot=primary]') as HTMLXmVideoElement;
    const secondary = this.el.querySelector('[slot=secondary]') as HTMLXmVideoElement;

    if (primary) this._connect(primary);
  }

  _connect(video: HTMLXmVideoElement) {

  }
}
