import { Cue } from './webVTT';

export interface CueListChangeEventProps {
  cues: Array<Cue>;
}

export interface ToggleControlProps {
  name: string;
  title: string;
  active: boolean;
}
