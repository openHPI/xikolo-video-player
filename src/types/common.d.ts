import { EventEmitter } from '@stencil/core';

interface XmVideo {
  currentTime(): Promise<number>;
  pause(): Promise<void>;
  play(): Promise<void>;
  seek(seconds: number): Promise<number>;
  setPlaybackRate(playbackRate: number): Promise<number>;
  volumeChanged(volume: number): Promise<number>;
  ratioLoadedEvent: EventEmitter<RatioLoadedDetail>;
  timeUpdateEvent: EventEmitter<TimeUpdateDetail>;
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
