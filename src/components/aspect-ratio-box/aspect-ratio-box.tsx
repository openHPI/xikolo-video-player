import {
  Component,
  Element,
  h,
  Prop,
  State,
} from '@stencil/core';


@Component({
  tag: 'xm-aspect-ratio-box',
  styleUrl: 'aspect-ratio-box.scss',
  shadow: true
})
export class AspectRatioBox {
  @Element() el: HTMLXmControlsElement;

  @Prop()
  public ratio: number = 1;

  @State()
  private _fullscreened: boolean = false;

  constructor() {
    this._fullscreened = document.fullscreenElement !== null;
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
  }

  render() {
    let bxStyle = {};

    if(!this._fullscreened) {
      bxStyle["paddingBottom"] = `${this.ratio * 100}%`;
    };

    return (
      <div class="bx" style={bxStyle}>
        <div class="ct"><slot /></div>
      </div>
    );
  }

  componentDidLoad() {
    window.addEventListener('fullscreenchange', this._fullscreenChanged)
  }

  componentWillUnload() {
    window.removeEventListener('fullscreenchange', this._fullscreenChanged)
  }

  private _fullscreenChanged(e) {
    this._fullscreened = document.fullscreenElement !== null;
  }
}
