import { EventEmitter } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';

interface XmVideoFunctions {
  currentTime(): Promise<number>;
  pause(): Promise<void>;
  play(): Promise<void>;
  seek(seconds: number): Promise<number>;
  setPlaybackRate(playbackRate: number): Promise<number>;
  volumeChanged(volume: number): Promise<number>;
  enterFullscreen(): Promise<void>;
  exitFullscreen(): Promise<void>;
}

interface XmVideoEvents {
  /**
   * Emit ratio as soon as it is available
   */
  ratioLoadedEvent: EventEmitter<RatioLoadedDetail>;
  /**
   * Emit timeupdate event to update player controls with duration
   * This needs to happen once initially and on every video timeupdate
   */
  timeUpdateEvent: EventEmitter<TimeUpdateDetail>;
  /**
   * Emit when video has ended
   */
  endedEvent: EventEmitter;
  /**
   * Emit when player is buffering
   */
  bufferingEvent: EventEmitter;
  /**
   * Emit when player is no longer buffering
   */
  bufferedEvent: EventEmitter;
}

interface XmVideo extends XmVideoFunctions, XmVideoEvents {
  active: boolean;
}

interface HTMLXmVideoElement extends XmVideo, HTMLStencilElement {
  volume: number;
}

interface RatioLoadedDetail {
  name: string;
  ratio: number;
}

interface TimeUpdateDetail {
  duration: number;
  seconds: number;
  percent?: number;
}

interface VideoAnalytics {
  playEvent: EventEmitter;
  pauseEvent: EventEmitter;
  seekedEvent: EventEmitter;
  endedEvent: EventEmitter;
  timeUpdateEvent: EventEmitter<TimeUpdateDetail>;
}

interface Presentations {
  [key: string]: { refs: string[]; label: string };
}
