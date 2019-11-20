import { Component, Element, Prop, EventEmitter, Event } from '@stencil/core';

import { bind } from '../../utils/bind';
import * as webvtt from "node-webvtt";
import { WebVTT } from '../../utils/webVTT';

@Component({
  tag: 'xm-text-track'
})
export class TextTrack {
  @Element() el: HTMLXmTextTrackElement;

  @Prop() language: string;
  @Prop() src: string;
  @Prop() label: string;

  private vtt:WebVTT = null;
  private promise: any;

  @Event({eventName: 'texttrack:loaded'}) textTrackLoadedEvent: EventEmitter;


  public componentWillLoad() {
    this.promise = this.loadFile(this.src);
  }

  private async loadFile(url:string) {
    return await fetch(url).then(response => response.text()).then(data => {
      this.vtt = webvtt.parse(data, {meta: true});
      if(this.vtt.valid) {
        this.extendMeta();
        this.textTrackLoadedEvent.emit({webVTT: this.vtt});
      }
    }).catch(error => console.error('Failed to load text track file: ', error));
  }

  @bind()
  private extendMeta() {
    if(this.label) this.vtt.meta.label = this.label;
    if(this.language) this.vtt.meta.language = this.language;
  }

}
