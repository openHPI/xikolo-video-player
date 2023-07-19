import { Component, Element, Prop, EventEmitter, Event } from '@stencil/core';

import * as webvtt from 'node-webvtt';
import { bind } from '../../utils/bind';
import { WebVTT } from '../../utils/webVTT';

@Component({
  tag: 'xm-text-track',
})
export class TextTrack {
  @Element() el: HTMLXmTextTrackElement;

  @Prop() language: string;

  @Prop() src: string;

  @Prop() label: string;

  @Prop() default: boolean;

  private vtt: WebVTT = null;

  @Event({ eventName: 'texttrack:loaded' }) textTrackLoadedEvent: EventEmitter;

  public componentWillLoad() {
    this.loadFile(this.src);
  }

  private async loadFile(url: string) {
    return fetch(url)
      .then((response) => response.text())
      .then((data) => {
        this.vtt = webvtt.parse(data, { meta: true });
        this.extendMeta();
        if (this.vtt.valid) {
          // Determines the index position of the current text track component in the HTML.
          const textTrackCollection = Array.from(
            this.el.parentNode.children,
          ).filter((element) => element.hasAttribute('language'));
          this.vtt.index = textTrackCollection.indexOf(this.el);
          this.textTrackLoadedEvent.emit({
            webVTT: this.vtt,
            total: textTrackCollection.length,
            isDefault: this.default,
          });
        } else {
          console.error(
            `Failed to load text track file: Check the meta data of the VTT file ${this.src} or set the <xm-text-track> attributes label and language.`,
          );
          this.textTrackLoadedEvent.emit({ webVTT: null });
        }
      })
      .catch((error) => {
        console.error(`Failed to load text track file ${this.src}:  ${error}`);
        this.textTrackLoadedEvent.emit({ webVTT: null });
      });
  }

  @bind()
  private extendMeta() {
    if (this.vtt.valid) {
      if (this.vtt.meta) {
        if (this.label) this.vtt.meta.label = this.label;
        if (this.language) this.vtt.meta.language = this.language;
      } else if (this.label && this.language) {
        this.vtt.meta = {
          label: this.label,
          language: this.language,
        };
      } else this.vtt.valid = false;
    } else {
      console.error(
        `Failed to load text track file: File ${this.src} is not valid`,
      );
    }
  }
}
