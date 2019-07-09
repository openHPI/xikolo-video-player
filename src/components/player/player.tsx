import {
  Component,
  Element,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

@Component({
  tag: 'xm-player',
  styleUrl: 'player.scss',
  shadow: true
})
export class Player {
  @Element() el: HTMLElement;

  render() {
    return (
      <div class="player">
        <xm-screen>
          {Array(this.el.children)}
        </xm-screen>
        <div class="controls">

        </div>
      </div>
    );
  }

  componentWillLoad() {

  }
}
