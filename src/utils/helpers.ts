import { HTMLXmVideoElement } from '../types/common';

/*
  Breakpoint test to check if device is small
 */
export const isSmall = window.matchMedia(
  'only screen and (max-width: 580px)'
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
  target: Element
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
  selector: string
): HTMLXmVideoElement => el.querySelector(selector);
