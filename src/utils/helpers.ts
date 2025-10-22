import { HTMLXmVideoElement } from '../types/common';

/*
  Breakpoint test to check if device is small
 */
export const isSmall = window.matchMedia(
  'only screen and (max-width: 376px)',
).matches;

export const fixDecimalPrecision = (number: number): number => {
  return parseFloat(number.toFixed(1));
};

export const isInteractiveElement = (target: Element): boolean => {
  const intElems = ['A', 'BUTTON'];

  if (intElems.includes(target.tagName)) {
    return true;
  }
  if (target.shadowRoot?.activeElement) {
    return isInteractiveElement(target.shadowRoot.activeElement);
  }
  return false;
};

export const hasDefaultScrollingBehavior = (
  key: string,
  target: Element,
): boolean => {
  return (
    (key === ' ' && !isInteractiveElement(target)) ||
    key === 'ArrowUp' ||
    key === 'ArrowDown'
  );
};

export const getPresentationNodes = (el: Element) =>
  el.querySelectorAll('xm-presentation');

export const getVideoElement = (
  el: Element,
  selector: string,
): HTMLXmVideoElement | null => el.querySelector(selector);

/**
 * Request fullscreen on the element.
 * If the fullscreen API is not supported,
 * fallback to the video enterFullscreen method.
 */
export const requestFullscreen = (
  element: HTMLXmPlayerElement,
  video: HTMLXmVideoElement,
) => {
  const requestMethod = element.requestFullscreen;

  return requestMethod?.call(element) ?? video.enterFullscreen();
};

/**
 * Exits fullscreen on the document.
 * If the fullscreen API is not supported,
 * fallback to the video exitFullscreen method.
 */
export const exitFullscreen = (video: HTMLXmVideoElement) => {
  const requestMethod = document.exitFullscreen;

  return requestMethod?.call(document) ?? video.exitFullscreen();
};
