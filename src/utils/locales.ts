export enum DE {
  // labels
  playbackRate = 'Wiedergabegeschwindigkeit',
  textTrack = 'Untertitel',
  textTrackDefault = 'Aus',
  // control button titles and aria-labels
  play = 'Wiedergabe',
  pause = 'Pause',
  restart = 'Nochmal',
  mute = 'Stumm schalten',
  unmute = 'Ton einschalten',
  settings = 'Einstellungen',
  enterFullscreen = 'Vollbildmodus öffnen',
  exitFullscreen = 'Vollbildmodus beenden',
  enableSubtitles = 'Untertitel einblenden',
  disableSubtitles = 'Untertitel ausblenden',
  changeVolume = 'Lautstärke ändern',
}

export enum EN {
  // labels
  playbackRate = 'Playback rate',
  textTrack = 'Subtitles',
  textTrackDefault = 'Off',
  // control button titles and aria-labels
  play = 'Play',
  pause = 'Pause',
  restart = 'Restart',
  mute = 'Mute',
  unmute = 'Unmute',
  settings = 'Settings',
  enterFullscreen = 'Enter full screen',
  exitFullscreen = 'Exit full screen',
  enableSubtitles = 'Enable subtitles',
  disableSubtitles = 'Disable subtitles',
  changeVolume = 'Control volume',
}

const locales = { de: DE, en: EN };

export type KnownLocale = keyof typeof locales;

export function isKnownLocale(locale: string): locale is KnownLocale {
  return Object.keys(locales).includes(locale);
}

export default locales;
