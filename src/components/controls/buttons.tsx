import {
  FunctionalComponent,
  h,
} from '@stencil/core';

import * as icon from '../../utils/icon';


interface FullscreenProps {
  fullscreen: boolean;
  onRequest: (e: Event) => void;
  onExit: (e: Event) => void;
}

export const Fullscreen: FunctionalComponent<FullscreenProps> = (props) => {
  if(props.fullscreen) {
    return <button onClick={props.onRequest} innerHTML={icon.Compress} />
  } else {
    return <button onClick={props.onExit} innerHTML={icon.Expand} />
  }
};


interface PlayPauseProps {
  playing: boolean;
  onPlay: (e: Event) => void;
  onPause: (e: Event) => void;
}

export const PlayPause: FunctionalComponent<PlayPauseProps> = (props) => {
  if(!props.playing) {
    return <button onClick={props.onPlay} innerHTML={icon.Play} />
  } else {
    return <button onClick={props.onPause} innerHTML={icon.Pause} />
  }
}
