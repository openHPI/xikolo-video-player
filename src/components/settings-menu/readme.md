# xm-settings-menu



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type            | Default     |
| ------------ | ------------- | ----------- | --------------- | ----------- |
| `status`     | `status`      |             | `Status`        | `undefined` |
| `textTracks` | `text-tracks` |             | `TextTrackList` | `undefined` |


## Events

| Event                        | Description | Type                                     |
| ---------------------------- | ----------- | ---------------------------------------- |
| `setting:changePlaybackRate` |             | `CustomEvent<{ playbackRate: number; }>` |
| `setting:changeTextTrack`    |             | `CustomEvent<{ textTrack: string; }>`    |


## Dependencies

### Used by

 - [xm-controls](../controls)

### Graph
```mermaid
graph TD;
  xm-controls --> xm-settings-menu
  style xm-settings-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
