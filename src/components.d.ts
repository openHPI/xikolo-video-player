/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Progress, Status } from "./utils/status";
import { TextTrackList } from "./utils/webVTT";
import { CueListChangeEventProps, ToggleControlProps } from "./utils/types";
import { RatioLoadedDetail, TimeUpdateDetail } from "./types/common";
export namespace Components {
    interface XmAspectRatioBox {
        /**
          * Video ratio, default is 16:9
         */
        "ratio": number;
    }
    interface XmControls {
        /**
          * JSON encoded sources for slides
         */
        "slidesSrc"?: string;
        /**
          * Player status
         */
        "status": Status;
        /**
          * List of text tracks
         */
        "textTracks": TextTrackList;
        /**
          * Array of toggle control configurations
         */
        "toggleControlButtons": Array<ToggleControlProps>;
    }
    interface XmKaltura {
        "active": boolean;
        /**
          * Call getCurrentTime on the Kaltura player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "currentTime": () => Promise<any>;
        /**
          * Duration of the video in seconds
         */
        "duration": number;
        "entryId": string;
        "partnerId": number;
        /**
          * Call pause on the Kaltura player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "pause": () => Promise<void>;
        /**
          * Call play on the Kaltura player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "play": () => Promise<void>;
        /**
          * URL for a poster to be displayed initially
         */
        "poster": string;
        /**
          * Number resulting from dividing the height by the width of the video. Common ratios are 0.75 (4:3) and 0.5625 (16:9)
         */
        "ratio": number;
        /**
          * Call seek on the Kaltura player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "seek": (seconds: number) => Promise<number>;
        /**
          * Call setPlaybackRate on the Kaltura player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "setPlaybackRate": (playbackRate: number) => Promise<number>;
        "volume": number;
    }
    interface XmPlayer {
        /**
          * Disable the text track
         */
        "disableTextTrack": () => Promise<void>;
        /**
          * Enable the text track
         */
        "enableTextTrack": () => Promise<void>;
        /**
          * Values of the keyboard keys the player listens to on the 'keydown` event.  Internal functions are only triggered when key is pressed without special key (alt, ctrl, meta, shift).
         */
        "getShortcutKeys": () => Promise<Array<string>>;
        "lang": string;
        /**
          * Sets the mute state true and the primary slot volume to 0.
         */
        "mute": () => Promise<void>;
        /**
          * Invoke the pause function on the player. Also sets the internal state to mode "paused"
         */
        "pause": () => Promise<void>;
        /**
          * Invoke the play function on the player. Also sets the internal state to mode "playing"
         */
        "play": () => Promise<void>;
        "playbackrate": number;
        /**
          * Invoke the seek function on the player.  Sometimes seeking starts playing the video. If the player was in paused state, we manually pause again.
          * @param seconds
         */
        "seek": (seconds: number) => Promise<void>;
        "showsubtitle": boolean;
        "slidesSrc"?: string;
        /**
          * Sets the mute state false and resets the primary slot video volume.
         */
        "unmute": () => Promise<void>;
        "volume": number;
    }
    interface XmPresentation {
        /**
          * Label for button shown in the settings
         */
        "label": string;
        /**
          * Internal name property Must be unique
         */
        "name": string;
        /**
          * Comma separated-string to define video sources to load. These are displayed in the specified order in the player.  For example: `reference='source-a,source-b'` will result in a primary video rendering source-a and a secondary screen will render source-b.
         */
        "reference": string;
    }
    interface XmScreen {
        "fullscreen": boolean;
        "primaryRatio": number;
        "secondaryRatio": number;
    }
    interface XmSettingsMenu {
        "status": Status;
        "textTracks": TextTrackList;
    }
    interface XmSlidePreviewBar {
        "duration": number;
        "onSeek": (seconds: number) => void;
        "slidesSrc"?: string;
    }
    interface XmSlider {
        "duration": number;
        "fullscreen": boolean;
        "progress": Progress;
        "slidesSrc"?: string;
    }
    interface XmTextTrack {
        "default": boolean;
        "label": string;
        "language": string;
        "src": string;
    }
    interface XmToggleControl {
        /**
          * Active state of toggle. Can function as on / off switch for feature
         */
        "active": boolean;
        /**
          * Reference to toggle control in EventListener and slot reference
         */
        "name": string;
        /**
          * Displays tooltip on hover
         */
        "title": string;
    }
    interface XmTooltip {
        "content": string;
        "image"?: string;
        "positionX"?: number;
        "show": boolean;
    }
    interface XmVimeo {
        "active": boolean;
        /**
          * Call getCurrentTime on the Vimeo player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "currentTime": () => Promise<number>;
        /**
          * Call pause on the Vimeo player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "pause": () => Promise<void>;
        /**
          * Call play on the Vimeo player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "play": () => Promise<void>;
        /**
          * Call seek on the Vimeo player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "seek": (seconds: number) => Promise<number>;
        /**
          * Call setPlaybackRate on the Vimeo player  If the player is not initialized, it will save the function so it can be applied once the player is ready.
         */
        "setPlaybackRate": (playbackRate: number) => Promise<number>;
        /**
          * Vimeo Video ID
         */
        "src": number;
        "volume": number;
    }
}
export interface XmControlsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmControlsElement;
}
export interface XmKalturaCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmKalturaElement;
}
export interface XmPlayerCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmPlayerElement;
}
export interface XmSettingsMenuCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmSettingsMenuElement;
}
export interface XmSliderCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmSliderElement;
}
export interface XmTextTrackCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmTextTrackElement;
}
export interface XmToggleControlCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmToggleControlElement;
}
export interface XmVimeoCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLXmVimeoElement;
}
declare global {
    interface HTMLXmAspectRatioBoxElement extends Components.XmAspectRatioBox, HTMLStencilElement {
    }
    var HTMLXmAspectRatioBoxElement: {
        prototype: HTMLXmAspectRatioBoxElement;
        new (): HTMLXmAspectRatioBoxElement;
    };
    interface HTMLXmControlsElement extends Components.XmControls, HTMLStencilElement {
    }
    var HTMLXmControlsElement: {
        prototype: HTMLXmControlsElement;
        new (): HTMLXmControlsElement;
    };
    interface HTMLXmKalturaElement extends Components.XmKaltura, HTMLStencilElement {
    }
    var HTMLXmKalturaElement: {
        prototype: HTMLXmKalturaElement;
        new (): HTMLXmKalturaElement;
    };
    interface HTMLXmPlayerElement extends Components.XmPlayer, HTMLStencilElement {
    }
    var HTMLXmPlayerElement: {
        prototype: HTMLXmPlayerElement;
        new (): HTMLXmPlayerElement;
    };
    interface HTMLXmPresentationElement extends Components.XmPresentation, HTMLStencilElement {
    }
    var HTMLXmPresentationElement: {
        prototype: HTMLXmPresentationElement;
        new (): HTMLXmPresentationElement;
    };
    interface HTMLXmScreenElement extends Components.XmScreen, HTMLStencilElement {
    }
    var HTMLXmScreenElement: {
        prototype: HTMLXmScreenElement;
        new (): HTMLXmScreenElement;
    };
    interface HTMLXmSettingsMenuElement extends Components.XmSettingsMenu, HTMLStencilElement {
    }
    var HTMLXmSettingsMenuElement: {
        prototype: HTMLXmSettingsMenuElement;
        new (): HTMLXmSettingsMenuElement;
    };
    interface HTMLXmSlidePreviewBarElement extends Components.XmSlidePreviewBar, HTMLStencilElement {
    }
    var HTMLXmSlidePreviewBarElement: {
        prototype: HTMLXmSlidePreviewBarElement;
        new (): HTMLXmSlidePreviewBarElement;
    };
    interface HTMLXmSliderElement extends Components.XmSlider, HTMLStencilElement {
    }
    var HTMLXmSliderElement: {
        prototype: HTMLXmSliderElement;
        new (): HTMLXmSliderElement;
    };
    interface HTMLXmTextTrackElement extends Components.XmTextTrack, HTMLStencilElement {
    }
    var HTMLXmTextTrackElement: {
        prototype: HTMLXmTextTrackElement;
        new (): HTMLXmTextTrackElement;
    };
    interface HTMLXmToggleControlElement extends Components.XmToggleControl, HTMLStencilElement {
    }
    var HTMLXmToggleControlElement: {
        prototype: HTMLXmToggleControlElement;
        new (): HTMLXmToggleControlElement;
    };
    interface HTMLXmTooltipElement extends Components.XmTooltip, HTMLStencilElement {
    }
    var HTMLXmTooltipElement: {
        prototype: HTMLXmTooltipElement;
        new (): HTMLXmTooltipElement;
    };
    interface HTMLXmVimeoElement extends Components.XmVimeo, HTMLStencilElement {
    }
    var HTMLXmVimeoElement: {
        prototype: HTMLXmVimeoElement;
        new (): HTMLXmVimeoElement;
    };
    interface HTMLElementTagNameMap {
        "xm-aspect-ratio-box": HTMLXmAspectRatioBoxElement;
        "xm-controls": HTMLXmControlsElement;
        "xm-kaltura": HTMLXmKalturaElement;
        "xm-player": HTMLXmPlayerElement;
        "xm-presentation": HTMLXmPresentationElement;
        "xm-screen": HTMLXmScreenElement;
        "xm-settings-menu": HTMLXmSettingsMenuElement;
        "xm-slide-preview-bar": HTMLXmSlidePreviewBarElement;
        "xm-slider": HTMLXmSliderElement;
        "xm-text-track": HTMLXmTextTrackElement;
        "xm-toggle-control": HTMLXmToggleControlElement;
        "xm-tooltip": HTMLXmTooltipElement;
        "xm-vimeo": HTMLXmVimeoElement;
    }
}
declare namespace LocalJSX {
    interface XmAspectRatioBox {
        /**
          * Video ratio, default is 16:9
         */
        "ratio"?: number;
    }
    interface XmControls {
        /**
          * Emitted when the playback rate is changed
         */
        "onControl:changePlaybackRate"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Event hook for custom control
         */
        "onControl:changeToggleControlActiveState"?: (event: XmControlsCustomEvent<ToggleControlProps>) => void;
        /**
          * Emitted when the volume is changed
         */
        "onControl:changeVolume"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the settings menu is closed
         */
        "onControl:closeSettingsMenu"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the text track is disabled
         */
        "onControl:disableTextTrack"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the text track is enabled
         */
        "onControl:enableTextTrack"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the full screen is entered
         */
        "onControl:enterFullscreen"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the full screen is exited
         */
        "onControl:exitFullscreen"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the playback rate menu is closed
         */
        "onControl:hidePlaybackRate"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when volume is muted
         */
        "onControl:mute"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the settings menu is opened
         */
        "onControl:openSettingsMenu"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted on pause
         */
        "onControl:pause"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted on play
         */
        "onControl:play"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when the playback rate menu is opened
         */
        "onControl:showPlaybackRate"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * Emitted when volume is unmuted
         */
        "onControl:unmute"?: (event: XmControlsCustomEvent<any>) => void;
        /**
          * JSON encoded sources for slides
         */
        "slidesSrc"?: string;
        /**
          * Player status
         */
        "status"?: Status;
        /**
          * List of text tracks
         */
        "textTracks"?: TextTrackList;
        /**
          * Array of toggle control configurations
         */
        "toggleControlButtons"?: Array<ToggleControlProps>;
    }
    interface XmKaltura {
        "active"?: boolean;
        /**
          * Duration of the video in seconds
         */
        "duration"?: number;
        "entryId"?: string;
        /**
          * Emit when video has ended
         */
        "onEnded"?: (event: XmKalturaCustomEvent<any>) => void;
        "onPause"?: (event: XmKalturaCustomEvent<any>) => void;
        "onPlay"?: (event: XmKalturaCustomEvent<any>) => void;
        /**
          * Emit ratio as soon as it is available
         */
        "onRatioLoaded"?: (event: XmKalturaCustomEvent<RatioLoadedDetail>) => void;
        "onSeeked"?: (event: XmKalturaCustomEvent<any>) => void;
        /**
          * Emit timeupdate event to update player controls with duration This needs to happen once initially and on every video timeupdate
         */
        "onTimeupdate"?: (event: XmKalturaCustomEvent<TimeUpdateDetail>) => void;
        "partnerId"?: number;
        /**
          * URL for a poster to be displayed initially
         */
        "poster"?: string;
        /**
          * Number resulting from dividing the height by the width of the video. Common ratios are 0.75 (4:3) and 0.5625 (16:9)
         */
        "ratio"?: number;
        "volume"?: number;
    }
    interface XmPlayer {
        "lang"?: string;
        /**
          * Emits list of currently active/visible cues by language and second to notifies external listeners that the active cues have changed
         */
        "onNotifyActiveCuesUpdated"?: (event: XmPlayerCustomEvent<CueListChangeEventProps>) => void;
        /**
          * Emits list of cues of currently selected language.
         */
        "onNotifyCueListChanged"?: (event: XmPlayerCustomEvent<CueListChangeEventProps>) => void;
        "playbackrate"?: number;
        "showsubtitle"?: boolean;
        "slidesSrc"?: string;
        "volume"?: number;
    }
    interface XmPresentation {
        /**
          * Label for button shown in the settings
         */
        "label"?: string;
        /**
          * Internal name property Must be unique
         */
        "name"?: string;
        /**
          * Comma separated-string to define video sources to load. These are displayed in the specified order in the player.  For example: `reference='source-a,source-b'` will result in a primary video rendering source-a and a secondary screen will render source-b.
         */
        "reference"?: string;
    }
    interface XmScreen {
        "fullscreen"?: boolean;
        "primaryRatio"?: number;
        "secondaryRatio"?: number;
    }
    interface XmSettingsMenu {
        "onSetting:changePlaybackRate"?: (event: XmSettingsMenuCustomEvent<any>) => void;
        "onSetting:changeTextTrack"?: (event: XmSettingsMenuCustomEvent<any>) => void;
        "status"?: Status;
        "textTracks"?: TextTrackList;
    }
    interface XmSlidePreviewBar {
        "duration"?: number;
        "onSeek"?: (seconds: number) => void;
        "slidesSrc"?: string;
    }
    interface XmSlider {
        "duration"?: number;
        "fullscreen"?: boolean;
        "onSlider:seek"?: (event: XmSliderCustomEvent<any>) => void;
        "progress"?: Progress;
        "slidesSrc"?: string;
    }
    interface XmTextTrack {
        "default"?: boolean;
        "label"?: string;
        "language"?: string;
        "onTexttrack:loaded"?: (event: XmTextTrackCustomEvent<any>) => void;
        "src"?: string;
    }
    interface XmToggleControl {
        /**
          * Active state of toggle. Can function as on / off switch for feature
         */
        "active"?: boolean;
        /**
          * Reference to toggle control in EventListener and slot reference
         */
        "name"?: string;
        /**
          * Emitted on componentDidLoad. Used in player to init CustomControlButton
         */
        "onToggleControl:loaded"?: (event: XmToggleControlCustomEvent<ToggleControlProps>) => void;
        /**
          * Displays tooltip on hover
         */
        "title"?: string;
    }
    interface XmTooltip {
        "content"?: string;
        "image"?: string;
        "positionX"?: number;
        "show"?: boolean;
    }
    interface XmVimeo {
        "active"?: boolean;
        "onBuffered"?: (event: XmVimeoCustomEvent<any>) => void;
        "onBuffering"?: (event: XmVimeoCustomEvent<any>) => void;
        /**
          * Emit when video has ended
         */
        "onEnded"?: (event: XmVimeoCustomEvent<any>) => void;
        "onPause"?: (event: XmVimeoCustomEvent<any>) => void;
        "onPlay"?: (event: XmVimeoCustomEvent<any>) => void;
        "onProgress"?: (event: XmVimeoCustomEvent<any>) => void;
        /**
          * Emit ratio as soon as it is available
         */
        "onRatioLoaded"?: (event: XmVimeoCustomEvent<any>) => void;
        "onSeeked"?: (event: XmVimeoCustomEvent<any>) => void;
        "onSeeking"?: (event: XmVimeoCustomEvent<any>) => void;
        /**
          * Emit timeupdate event to update player controls with duration This needs to happen once initially and on every video timeupdate
         */
        "onTimeupdate"?: (event: XmVimeoCustomEvent<any>) => void;
        /**
          * Vimeo Video ID
         */
        "src"?: number;
        "volume"?: number;
    }
    interface IntrinsicElements {
        "xm-aspect-ratio-box": XmAspectRatioBox;
        "xm-controls": XmControls;
        "xm-kaltura": XmKaltura;
        "xm-player": XmPlayer;
        "xm-presentation": XmPresentation;
        "xm-screen": XmScreen;
        "xm-settings-menu": XmSettingsMenu;
        "xm-slide-preview-bar": XmSlidePreviewBar;
        "xm-slider": XmSlider;
        "xm-text-track": XmTextTrack;
        "xm-toggle-control": XmToggleControl;
        "xm-tooltip": XmTooltip;
        "xm-vimeo": XmVimeo;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "xm-aspect-ratio-box": LocalJSX.XmAspectRatioBox & JSXBase.HTMLAttributes<HTMLXmAspectRatioBoxElement>;
            "xm-controls": LocalJSX.XmControls & JSXBase.HTMLAttributes<HTMLXmControlsElement>;
            "xm-kaltura": LocalJSX.XmKaltura & JSXBase.HTMLAttributes<HTMLXmKalturaElement>;
            "xm-player": LocalJSX.XmPlayer & JSXBase.HTMLAttributes<HTMLXmPlayerElement>;
            "xm-presentation": LocalJSX.XmPresentation & JSXBase.HTMLAttributes<HTMLXmPresentationElement>;
            "xm-screen": LocalJSX.XmScreen & JSXBase.HTMLAttributes<HTMLXmScreenElement>;
            "xm-settings-menu": LocalJSX.XmSettingsMenu & JSXBase.HTMLAttributes<HTMLXmSettingsMenuElement>;
            "xm-slide-preview-bar": LocalJSX.XmSlidePreviewBar & JSXBase.HTMLAttributes<HTMLXmSlidePreviewBarElement>;
            "xm-slider": LocalJSX.XmSlider & JSXBase.HTMLAttributes<HTMLXmSliderElement>;
            "xm-text-track": LocalJSX.XmTextTrack & JSXBase.HTMLAttributes<HTMLXmTextTrackElement>;
            "xm-toggle-control": LocalJSX.XmToggleControl & JSXBase.HTMLAttributes<HTMLXmToggleControlElement>;
            "xm-tooltip": LocalJSX.XmTooltip & JSXBase.HTMLAttributes<HTMLXmTooltipElement>;
            "xm-vimeo": LocalJSX.XmVimeo & JSXBase.HTMLAttributes<HTMLXmVimeoElement>;
        }
    }
}
