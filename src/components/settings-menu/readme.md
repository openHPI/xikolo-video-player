# xm-settings-menu



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute | Description | Type            | Default     |
| ------------ | --------- | ----------- | --------------- | ----------- |
| `status`     | --        |             | `Status`        | `undefined` |
| `textTracks` | --        |             | `TextTrackList` | `undefined` |


## Events

| Event                        | Description | Type               |
| ---------------------------- | ----------- | ------------------ |
| `setting:changePlaybackRate` |             | `CustomEvent<any>` |
| `setting:changeTextTrack`    |             | `CustomEvent<any>` |


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
