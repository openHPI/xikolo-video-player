import {
  Component,
  Element,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

@Component({
  tag: 'xm-media',
  styleUrl: 'media.scss',
  shadow: true
})
export class Media {
  @Element() el: HTMLElement;

  render() {
    return <slot />;
  }
}
