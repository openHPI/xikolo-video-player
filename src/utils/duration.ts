/**
 * Format a duration has HH:MM:SS.
 *
 * Negative durations are returned with a leading minus symbol. Formatting is
 * capped at hours e.g. a two day long duration is returned 48:00:00.
 *
 * @param {number} seconds Duration to format in seconds.
 */
export function format(seconds: number) : string {
  const negative = seconds < 0;
  const secs = Math.abs(Math.floor(seconds));
  const s = secs % 60;
  const m = Math.floor(secs / 60) % 60;
  const h = Math.floor(secs / 3600);

  return `${negative ? '-' : ''}${h > 0 ? lzpad(h) + ':' : ''}${lzpad(m)}:${lzpad(s)}`;
}

// left pad a number with zeros
function lzpad(num: number, digits = 2) {
  const negative = num < 0;

  let buffer = Math.abs(num).toString();

  if (buffer.length < digits) {
    buffer = new Array(digits - buffer.length + 1).join('0').concat(buffer)
  }

  return (negative ? '-' : '') + buffer;
}
