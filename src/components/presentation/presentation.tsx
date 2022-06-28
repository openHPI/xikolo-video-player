import { Component, Prop } from '@stencil/core';

interface XmPresentation {
  reference: string;
  name: string;
  label: string;
}

@Component({
  tag: 'xm-presentation',
})
export class Presentation implements XmPresentation {
  /**
   * Comma separated-string to define video sources to load.
   * These are displayed in the specified order in the player.
   *
   * For example: `reference='source-a,source-b'`
   * will result in a primary video rendering source-a and
   * a secondary screen will render source-b.
   */
  @Prop() reference: string;

  /**
   * Internal name property
   * Must be unique
   */
  @Prop() name: string;

  /**
   * Label for button shown in the settings
   */
  @Prop() label: string;
}
