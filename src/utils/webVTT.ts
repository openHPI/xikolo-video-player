import { textTrackDefault } from './settings';
import locales from './locales';

export interface Cue {
  end: number;
  identifier: string;
  start: number;
  styles: string;
  text: string;
}

export interface Meta {
  language: string;
  label: string;
  kind?: string;
}

export interface WebVTT {
  cues: Array<Cue>;
  errors?: any;
  meta: Meta;
  strict: boolean;
  valid: boolean;
  index: number;
}

export class TextTrackList {
  protected vttList: Array<WebVTT> = [];
  protected textTracks: Array<Meta> = [];
  protected currentCues: Array<Cue> = null;
  protected currentLanguage: null;
  protected loadedFiles: number = 0;
  protected totalFiles: number = 0;

  public addWebVTT(webVTT: WebVTT, total: number) {
    // Inserts the new webVTT file at the HTML index position (presort).
    this.vttList.splice(webVTT.index, 0, webVTT);
    this.textTracks.splice(webVTT.index, 0, webVTT.meta);

    this.loadedFiles++;
    this.totalFiles = total;
    this.sortAndInitLists();
  }

  public increaseLoadedFiles() {
    this.loadedFiles++;
    if (this.totalFiles > 0) this.sortAndInitLists();
  }

  protected sortAndInitLists() {
    // Sort list after all files are loaded
    if (this.loadedFiles === this.totalFiles) {
      this.textTracks = [];
      this.vttList.sort(this.compareWebVTTList);
      this.vttList.forEach((webVTT) => this.textTracks.push(webVTT.meta));
    }
  }

  protected collectCues(language: string) {
    const webVTT = this.vttList.find((vtt) => vtt.meta.language === language);
    if (webVTT && webVTT.cues) {
      this.currentCues = webVTT.cues;
      return;
    }
    this.currentCues = null;
  }

  public getActiveCues(seconds: number, language: string) {
    if (language !== this.currentLanguage) this.collectCues(language);
    if (this.currentCues === null) return null;
    const cues: Array<Cue> = this.currentCues.filter(
      (cue) => cue.start <= seconds && cue.end >= seconds
    );
    return cues.length ? cues : null;
  }

  public getTextTracks() {
    return this.textTracks.length ? this.textTracks : null;
  }

  public getTextTrackValues() {
    return [textTrackDefault].concat(
      this.textTracks.map((meta) => meta.language)
    );
  }

  public getTextTrackLabels(language) {
    return [locales[language].textTrackDefault].concat(
      this.textTracks.map((meta) => meta.label)
    );
  }

  public compareCueLists(a: Array<Cue>, b: Array<Cue>) {
    if (a === null && b === null) return true;
    if (
      a === null ||
      b === null ||
      a.length !== b.length ||
      a[0].identifier !== b[0].identifier
    ) {
      return false;
    }
    return true;
  }

  public compareWebVTTList(a: WebVTT, b: WebVTT) {
    return a.index > b.index ? 1 : -1;
  }
}
