import {
  Component,
  Element,
  Prop,
  h,
  Event,
  EventEmitter,
  State,
} from '@stencil/core';
import { Progress } from '../../utils/status';
import { bind } from '../../utils/bind';

@Component({
  tag: 'xm-slider',
  styleUrl: 'slider.scss',
  shadow: true,
})
export class Slider {
  @Element() el: HTMLXmSliderElement;

  @Prop() duration: number;
  @Prop() progress: Progress;

  @Event({ eventName: 'slider:seek' }) seekEvent: EventEmitter;

  public render() {
    return (
      <input
        class="slider"
        part="slider"
        type="range"
        min="0"
        max={this.duration}
        step="any"
        autocomplete="off"
        // Convert to string as zero (0) is otherwise ignored and
        // not rendered at all. This would show a default progress
        // bar of around 50%.
        value={this.progress.seconds.toString()}
        onChange={this.onSeek}
        onInput={this.onSeek}
      />
    );
  }

  @bind()
  protected onSeek(e: Event) {
    const el = e.target as HTMLInputElement;
    const seconds = parseFloat(el.value);
    this.seekEvent.emit({ seconds: seconds });
  }
}
