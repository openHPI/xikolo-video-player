/*
  Breakpoint test to check if device is small
 */
export const isSmall = window.matchMedia(
  'only screen and (max-width: 580px)'
).matches;

/**
 * Returns a pseudo-random identifier string
 * Not cryptographically save
 */
export const generateId = (prefix: string) => {
  return prefix + Math.random().toString(16).substring(2);
};
