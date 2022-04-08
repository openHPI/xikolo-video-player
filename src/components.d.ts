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
        "ratio": number;
    }
    interface XmControls {
        "status": Status;
        "textTracks": TextTrackList;
        "toggleControlButtons": Array<ToggleControlProps>;
    }
    interface XmKaltura {
        "currentTime": () => Promise<any>;
        /**
          * Duration of the video in seconds
         */
        "duration": number;
        "entryId": string;
        "partnerId": number;
        "pause": () => Promise<void>;
        "play": () => Promise<void>;
        /**
          * Number resulting from dividing the height by the width of the video. Common ratios are 0.75 (4:3) and 0.5625 (16:9)
         */
        "ratio": number;
        /**
          * @param seconds
         */
        "seek": (seconds: number) => Promise<number>;
        /**
          * @param playbackRate
         */
        "setPlaybackRate": (playbackRate: number) => Promise<number>;
        "volume": number;
    }
    interface XmPlayer {
        "disableTextTrack": () => Promise<void>;
        "enableTextTrack": () => Promise<void>;
        /**
          * Values of the keyboard keys the player listens to on the 'keydown` event
         */
        "getShortcutKeys": () => Promise<Array<string>>;
        "lang": string;
        /**
          * Sets the mute state true and the primary slot volume to 0.
         */
        "mute": () => Promise<void>;
        "pause": () => Promise<void>;
        "play": () => Promise<void>;
        "playbackrate": number;
        "seek": (seconds: number) => Promise<void>;
        "showsubtitle": boolean;
        /**
          * Sets the mute state false and resets the primary slot video volume.
         */
        "unmute": () => Promise<void>;
        "volume": number;
    }
    interface XmScreen {
        "fullscreen": boolean;
        "pip": boolean;
    }
    interface XmSettingsMenu {
        "status": Status;
        "textTracks": TextTrackList;
    }
    interface XmSlider {
        "duration": number;
        "fullscreen": boolean;
        "progress": Progress;
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
        "positionX"?: number;
        "show": boolean;
    }
    interface XmVimeo {
        "currentTime": () => Promise<number>;
        "getAspectRatio": () => Promise<number>;
        "getDimensions": () => Promise<{ width: number; height: number; }>;
        "getDuration": () => Promise<number>;
        "pause": () => Promise<void>;
        "play": () => Promise<void>;
        "seek": (seconds: number) => Promise<number>;
        "setPlaybackRate": (playbackRate: number) => Promise<number>;
        /**
          * Vimeo Video ID
         */
        "src": number;
        "volume": number;
    }
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
        "xm-screen": HTMLXmScreenElement;
        "xm-settings-menu": HTMLXmSettingsMenuElement;
        "xm-slider": HTMLXmSliderElement;
        "xm-text-track": HTMLXmTextTrackElement;
        "xm-toggle-control": HTMLXmToggleControlElement;
        "xm-tooltip": HTMLXmTooltipElement;
        "xm-vimeo": HTMLXmVimeoElement;
    }
}
declare namespace LocalJSX {
    interface XmAspectRatioBox {
        "ratio"?: number;
    }
    interface XmControls {
        "onControl:changePlaybackRate"?: (event: CustomEvent<any>) => void;
        /**
          * Event hook for custom control
         */
        "onControl:changeToggleControlActiveState"?: (event: CustomEvent<ToggleControlProps>) => void;
        "onControl:changeVolume"?: (event: CustomEvent<any>) => void;
        "onControl:closeSettingsMenu"?: (event: CustomEvent<any>) => void;
        "onControl:disableTextTrack"?: (event: CustomEvent<any>) => void;
        "onControl:enableTextTrack"?: (event: CustomEvent<any>) => void;
        "onControl:enterFullscreen"?: (event: CustomEvent<any>) => void;
        "onControl:exitFullscreen"?: (event: CustomEvent<any>) => void;
        "onControl:hidePlaybackRate"?: (event: CustomEvent<any>) => void;
        "onControl:mute"?: (event: CustomEvent<any>) => void;
        "onControl:openSettingsMenu"?: (event: CustomEvent<any>) => void;
        "onControl:pause"?: (event: CustomEvent<any>) => void;
        "onControl:play"?: (event: CustomEvent<any>) => void;
        "onControl:showPlaybackRate"?: (event: CustomEvent<any>) => void;
        "onControl:unmute"?: (event: CustomEvent<any>) => void;
        "status"?: Status;
        "textTracks"?: TextTrackList;
        "toggleControlButtons"?: Array<ToggleControlProps>;
    }
    interface XmKaltura {
        /**
          * Duration of the video in seconds
         */
        "duration"?: number;
        "entryId"?: string;
        /**
          * Emit when video has ended
         */
        "onEnded"?: (event: CustomEvent<any>) => void;
        "onPause"?: (event: CustomEvent<any>) => void;
        "onPlay"?: (event: CustomEvent<any>) => void;
        /**
          * Emit ratio as soon as it is available
         */
        "onRatioLoaded"?: (event: CustomEvent<RatioLoadedDetail>) => void;
        "onSeeked"?: (event: CustomEvent<any>) => void;
        /**
          * Emit timeupdate event to update player controls with duration This needs to happen once initially and on every video timeupdate
         */
        "onTimeupdate"?: (event: CustomEvent<TimeUpdateDetail>) => void;
        "partnerId"?: number;
        /**
          * Number resulting from dividing the height by the width of the video. Common ratios are 0.75 (4:3) and 0.5625 (16:9)
         */
        "ratio"?: number;
        "volume"?: number;
    }
    interface XmPlayer {
        "lang"?: string;
        "onNotifyActiveCuesUpdated"?: (event: CustomEvent<CueListChangeEventProps>) => void;
        "onNotifyCueListChanged"?: (event: CustomEvent<CueListChangeEventProps>) => void;
        "playbackrate"?: number;
        "showsubtitle"?: boolean;
        "volume"?: number;
    }
    interface XmScreen {
        "fullscreen"?: boolean;
        "pip"?: boolean;
    }
    interface XmSettingsMenu {
        "onSetting:changePlaybackRate"?: (event: CustomEvent<any>) => void;
        "onSetting:changeTextTrack"?: (event: CustomEvent<any>) => void;
        "status"?: Status;
        "textTracks"?: TextTrackList;
    }
    interface XmSlider {
        "duration"?: number;
        "fullscreen"?: boolean;
        "onSlider:seek"?: (event: CustomEvent<any>) => void;
        "progress"?: Progress;
    }
    interface XmTextTrack {
        "default"?: boolean;
        "label"?: string;
        "language"?: string;
        "onTexttrack:loaded"?: (event: CustomEvent<any>) => void;
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
        "onToggleControl:loaded"?: (event: CustomEvent<ToggleControlProps>) => void;
        /**
          * Displays tooltip on hover
         */
        "title"?: string;
    }
    interface XmTooltip {
        "content"?: string;
        "positionX"?: number;
        "show"?: boolean;
    }
    interface XmVimeo {
        "onBuffered"?: (event: CustomEvent<any>) => void;
        "onBuffering"?: (event: CustomEvent<any>) => void;
        /**
          * Emit when video has ended
         */
        "onEnded"?: (event: CustomEvent<any>) => void;
        "onPause"?: (event: CustomEvent<any>) => void;
        "onPlay"?: (event: CustomEvent<any>) => void;
        "onProgress"?: (event: CustomEvent<any>) => void;
        /**
          * Emit ratio as soon as it is available
         */
        "onRatioLoaded"?: (event: CustomEvent<any>) => void;
        "onSeeked"?: (event: CustomEvent<any>) => void;
        "onSeeking"?: (event: CustomEvent<any>) => void;
        /**
          * Emit timeupdate event to update player controls with duration This needs to happen once initially and on every video timeupdate
         */
        "onTimeupdate"?: (event: CustomEvent<any>) => void;
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
        "xm-screen": XmScreen;
        "xm-settings-menu": XmSettingsMenu;
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
            "xm-screen": LocalJSX.XmScreen & JSXBase.HTMLAttributes<HTMLXmScreenElement>;
            "xm-settings-menu": LocalJSX.XmSettingsMenu & JSXBase.HTMLAttributes<HTMLXmSettingsMenuElement>;
            "xm-slider": LocalJSX.XmSlider & JSXBase.HTMLAttributes<HTMLXmSliderElement>;
            "xm-text-track": LocalJSX.XmTextTrack & JSXBase.HTMLAttributes<HTMLXmTextTrackElement>;
            "xm-toggle-control": LocalJSX.XmToggleControl & JSXBase.HTMLAttributes<HTMLXmToggleControlElement>;
            "xm-tooltip": LocalJSX.XmTooltip & JSXBase.HTMLAttributes<HTMLXmTooltipElement>;
            "xm-vimeo": LocalJSX.XmVimeo & JSXBase.HTMLAttributes<HTMLXmVimeoElement>;
        }
    }
}
