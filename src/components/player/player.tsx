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

  connectedCallback() {
    console.log('connectedCallback: xm-player');
    this.el.shadowRoot.addEventListener('ioc:request', (e: CustomEvent) => {
      // switch(e.detail.name) {
      //   case "state-manager":
      //     e.detail.result = this.stateManager;
      //     break;
      // }
      console.log('IOC request intercepted', e)
    });
  }

  componentDidLoad() {
    // console.log('didLoad: xm-player');
    // this.el.addEventListener('ioc:request', e => {
    //   console.log('ioc:request', e)
    // })
  }
}
