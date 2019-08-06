import { FunctionalComponent, h } from '@stencil/core';

import * as icon from '../../utils/icon';
import { Status, Mode } from '../../utils/status';
import { format } from '../../utils/duration';


interface FullscreenProps {
  fullscreen: boolean;
  onRequest: (e: Event) => void;
  onExit: (e: Event) => void;
}

export const Fullscreen: FunctionalComponent<FullscreenProps> = props => {
  if(props.fullscreen) {
    return <button onClick={props.onRequest} innerHTML={icon.Compress} />
  } else {
    return <button onClick={props.onExit} innerHTML={icon.Expand} />
  }
}


interface ControlProps {
  status: Status;
  onPlay: (e: Event) => void;
  onPause: (e: Event) => void;
}

export const Control: FunctionalComponent<ControlProps> = props => {
  if(!(props.status.mode === Mode.PLAYING)) {
    return <button onClick={props.onPlay} innerHTML={icon.Play} />
  } else {
    return <button onClick={props.onPause} innerHTML={icon.Pause} />
  }
}


interface CurrentTimeProps {
  status: Status
}

export const CurrentTime: FunctionalComponent<CurrentTimeProps> = props => {
  const { duration, progress } = props.status;

  return (
    <span class="controls__time" title={`Time left of ${format(duration)}s`}>
      -{format(duration - progress.seconds)}
    </span>
  );
}


interface SliderProps {
  status: Status;
  onSeek: (seconds: number) => void;
}

export const Slider: FunctionalComponent<SliderProps> = props => {
  const { duration, progress } = props.status;

  const fnSeek = (e: Event) => {
    const el = e.target as HTMLInputElement;
    props.onSeek(parseFloat(el.value));
  };

  return (
    <input class="controls__slider"
      part="slider"
      type="range"
      min="0"
      max={duration}
      step="any"
      autocomplete="off"
      // Convert to string as zero (0) is otherwise ignored and
      // not rendered at all. This will show a default progress
      // bar of around 50%.
      value={progress.seconds.toString()}
      onInput={fnSeek}
    />
  );
}
