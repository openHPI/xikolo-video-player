import { Component, Element, Prop, h, State } from '@stencil/core';

import { format } from '../../utils/duration';

interface Hover {
  status: boolean;
  time: string;
  positionX: number;
  thumbnail: string;
}

interface Slide {
  startPosition: number;
  duration: number;
  thumbnail: string;
}

@Component({
  tag: 'xm-slide-preview-bar',
  styleUrl: 'slide-preview-bar.scss',
  shadow: true,
})
export class SlidePreviewBar {
  private slides: Slide[] = [];

  @Element() el: HTMLXmSlidePreviewBarElement;

  @State()
  hover: Hover = {
    status: false,
    time: '00:00',
    positionX: 0,
    thumbnail: '',
  };

  @Prop() duration: number;

  @Prop() slidesSrc?: string;

  @Prop() onSeek: (seconds: number) => void;

  componentWillLoad() {
    this.getSlides(this.slidesSrc);
  }

  public render() {
    return (
      <div>
        {this.slides.map((slide) => (
          <div
            class="slide"
            data-start={slide.startPosition}
            data-duration={slide.duration}
            data-thumbnail={slide.thumbnail}
            style={{
              left: `${(slide.startPosition * 100) / this.duration}%`,
              width: `${(slide.duration * 100) / this.duration}%`,
            }}
            onClick={this.handleClick}
            onMouseEnter={this.togglePreviewTooltip}
            onMouseLeave={this.togglePreviewTooltip}
            onMouseMove={this.onMove}
          ></div>
        ))}

        <xm-tooltip
          image={this.hover.thumbnail}
          show={this.hover.status}
          content={this.hover.time}
          positionX={this.hover.positionX}
        />
      </div>
    );
  }

  private handleClick = (e: MouseEvent) => {
    const seconds = this.getSecondsFromCurrentMousePosition(e);
    this.onSeek(seconds);
  };

  private onMove = (e: MouseEvent) => {
    const seconds = this.getSecondsFromCurrentMousePosition(e);
    const time = format(seconds);

    const positionX = (this.el.clientWidth * seconds) / this.duration;

    this.hover = {
      ...this.hover,
      time,
      positionX,
    };
  };

  private togglePreviewTooltip = (e: MouseEvent) => {
    const el = e.target as HTMLInputElement;

    this.hover = {
      ...this.hover,
      status: !this.hover.status,

      thumbnail: el.dataset.thumbnail,
    };
  };

  private getSecondsFromCurrentMousePosition = (e: MouseEvent) => {
    const el = e.target as HTMLInputElement;
    var rect = el.getBoundingClientRect();
    var mousePosition = e.clientX - rect.left;

    // Knowing the position of the mouse on the corresponding slide
    // div and its data attributes we determine the point in seconds
    // from the overall progress bar where the mouse is located
    const seconds =
      parseFloat(el.dataset.start) +
      (mousePosition * parseFloat(el.dataset.duration)) / rect.width;

    return seconds;
  };

  private getSlides = (slidesSrc: string) => {
    let slides: Slide[] = JSON.parse(slidesSrc);

    slides.forEach((slide, index: number) => {
      if (index === 0) {
        // Ensure the first slide starts at the beginning of the bar
        slide.startPosition = 0;
      }

      const isLastSlide = index === slides.length - 1;

      slide.duration = isLastSlide
        ? this.duration - slide.startPosition
        : slides[index + 1].startPosition - slide.startPosition;
    });

    this.slides = slides;
  };
}
