import { Status } from '../components';
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
 * Takes vendor prefixes into account to support all browsers.
 * If no fullscreen API is available, adds the pseudo-fullscreen class.
 */
export const requestFullscreen = (element: Element) => {
  const requestMethod =
    element.requestFullscreen || (element as any).webkitRequestFullscreen;

  if (requestMethod) {
    return requestMethod.call(element);
  }

  // Add fallback to emulate fullscreen via CSS
  element.classList.add('player--pseudo-fullscreen');

  return Promise.resolve();
};

/**
 * Exits fullscreen on the document.
 * Takes vendor prefixes into account to support all browsers.
 * If no fullscreen API is available, removes the pseudo-fullscreen class.
 */
export const exitFullscreen = (element: Element) => {
  const requestMethod =
    document.exitFullscreen || (document as any).webkitExitFullscreen;

  if (requestMethod) {
    return requestMethod.call(document);
  }

  // Remove fallback to emulate fullscreen via CSS
  element.classList.remove('player--pseudo-fullscreen');
  return Promise.resolve();
};
