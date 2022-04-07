import { EventEmitter } from '@stencil/core';

interface XmVideo {
  currentTime(): Promise<number>;
  pause(): Promise<void>;
  play(): Promise<void>;
  seek(seconds: number): Promise<number>;
  setPlaybackRate(playbackRate: number): Promise<number>;
  volumeChanged(volume: number): Promise<number>;
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
