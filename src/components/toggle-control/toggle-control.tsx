import { Component, Prop, EventEmitter, Event, h } from '@stencil/core';
import { ToggleControlProps } from '../../utils/types';

@Component({
  tag: 'xm-toggle-control',
  shadow: true,
})
export class ToggleControl {
  /**
   * Reference to toggle control in EventListener and slot reference
   */
  @Prop() name: string;

  /**
   * Displays tooltip on hover
   */
  @Prop({ attribute: 'title' }) title: string;

  /**
   * Active state of toggle. Can function as on / off switch for feature
   */
  @Prop({ mutable: true }) active: boolean;

  /**
   * Emitted on componentDidLoad. Used in player to init CustomControlButton
   */
  @Event({ eventName: 'toggleControl:loaded' })
  toggleControlLoaded: EventEmitter<ToggleControlProps>;

  public render() {
    return (
      <div>
        <slot name="icon"></slot>
      </div>
    );
  }

  public componentDidLoad() {
    this.toggleControlLoaded.emit({
      name: this.name,
      title: this.title,
      active: this.active,
    });
  }
}
