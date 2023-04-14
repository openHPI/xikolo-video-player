import {
  Component,
  Element,
  Prop,
  h,
  Event,
  EventEmitter,
  State,
} from '@stencil/core';
import { bind } from '../../utils/bind';
import { format } from '../../utils/duration';

interface HoverStatus {
  hover: boolean;
  hoverTime: string;
  hoverPositionX: number;
}

@Component({
  tag: 'xm-slider',
  styleUrl: 'slider.scss',
  shadow: true,
})
export class Slider {
  @Element() el: HTMLXmSliderElement;

  @Prop() duration: number;

  /**
   * Video progress in seconds
   */
  @Prop() progress: number;

  @Prop() fullscreen: boolean;

  @Prop() slidesSrc?: string;

  @State()
  private hoverStatus: HoverStatus = {
    hover: false,
    hoverTime: '00:00',
    hoverPositionX: 0,
  };

  @Event({ eventName: 'slider:seek' }) seekEvent: EventEmitter;

  public render() {
    return (
      <div class="slider">
        <input
          class="slider__progress"
          part="slider"
          type="range"
          min="0"
          max={this.duration}
          step="any"
          autocomplete="off"
          // Convert to string as zero (0) is otherwise ignored and
          // not rendered at all. This would show a default progress
          // bar of around 50%.
          value={this.progress.toString()}
          onChange={this.onSeek}
          onInput={this.onSeek}
          onMouseMove={this.onMove}
          onMouseEnter={this.toggleTooltip}
          onMouseLeave={this.toggleTooltip}
        />
        {this.slidesSrc && this.duration ? (
          <xm-slide-preview-bar
            duration={this.duration}
            slidesSrc={this.slidesSrc}
            onSeek={this.handleClickOnSlidePreview}
          />
        ) : (
          <xm-tooltip
            show={this.hoverStatus.hover}
            content={this.hoverStatus.hoverTime}
            positionX={this.hoverStatus.hoverPositionX}
          />
        )}
      </div>
    );
  }

  @bind()
  protected onSeek(e: Event) {
    const el = e.target as HTMLInputElement;
    const seconds = parseFloat(el.value);
    this.seekEvent.emit({ seconds });
  }

  @bind()
  protected onMove(e: MouseEvent) {
    const el = e.target as HTMLInputElement;
    // Uses the position of the mouse on the progress bar to
    // work out what point in the video the user will skip to if
    // the progress bar is clicked at that point
    const seconds = (e.offsetX / el.clientWidth) * this.duration;
    const time = format(seconds);

    // Get mouse position
    const rect = el.getBoundingClientRect();
    const position = e.pageX - rect.left;

    this.hoverStatus = {
      ...this.hoverStatus,
      hoverTime: time,
      hoverPositionX: position,
    };
  }

  @bind()
  protected toggleTooltip() {
    this.hoverStatus = {
      ...this.hoverStatus,
      hover: !this.hoverStatus.hover,
    };
  }

  private handleClickOnSlidePreview = (seconds: number) => {
    this.seekEvent.emit({ seconds });
  };
}
