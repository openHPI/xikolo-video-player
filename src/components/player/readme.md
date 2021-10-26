# video-player

All css variables are defined in the _vars.scss partial file.
The namespace for :root or xm-player definitions from the outside is: "--vps-variable-name" eg --vps-slider-color.
And intern we used: "--vp-variable-name" eg --vp-slider-color.
Now you can define default values for all used variables. :)

## Special behavior of the video-player

Below are listed all the properties of the player. On small screens, the volume slider is hidden to allow more room
for the short-cut keys. If you set the volume property lower than 1.0, this setting is ignored on small devices,
so that the user can change the volume with the device keys.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type      | Default                               |
| -------------- | -------------- | ----------- | --------- | ------------------------------------- |
| `lang`         | `lang`         |             | `string`  | `undefined`                           |
| `playbackrate` | `playbackrate` |             | `number`  | `defaultStatus.settings.playbackRate` |
| `showsubtitle` | `showsubtitle` |             | `boolean` | `defaultStatus.subtitle.enabled`      |
| `volume`       | `volume`       |             | `number`  | `defaultStatus.volume`                |


## Events

| Event                     | Description | Type                                   |
| ------------------------- | ----------- | -------------------------------------- |
| `notifyActiveCuesUpdated` |             | `CustomEvent<CueListChangeEventProps>` |
| `notifyCueListChanged`    |             | `CustomEvent<CueListChangeEventProps>` |


## Methods

### `disableTextTrack() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `enableTextTrack() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getShortcutKeys() => Promise<Array<string>>`

Values of the keyboard keys the player listens to on the 'keydown` event

#### Returns

Type: `Promise<string[]>`



### `mute() => Promise<void>`

Sets the mute state true and the primary slot volume to 0.

#### Returns

Type: `Promise<void>`



### `pause() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `play() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `seek(seconds: number) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `unmute() => Promise<void>`

Sets the mute state false and resets the primary slot video volume.

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [xm-screen](../screen)
- [xm-controls](../controls)

### Graph
```mermaid
graph TD;
  xm-player --> xm-screen
  xm-player --> xm-controls
  xm-controls --> xm-settings-menu
  xm-controls --> xm-slider
  xm-slider --> xm-tooltip
  style xm-player fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
