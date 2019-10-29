# xm-controls



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `status` | --        |             | `Status` | `undefined` |


## Events

| Event                       | Description | Type               |
| --------------------------- | ----------- | ------------------ |
| `control:changeVolume`      |             | `CustomEvent<any>` |
| `control:closeSettingsMenu` |             | `CustomEvent<any>` |
| `control:enterFullscreen`   |             | `CustomEvent<any>` |
| `control:exitFullscreen`    |             | `CustomEvent<any>` |
| `control:mute`              |             | `CustomEvent<any>` |
| `control:openSettingsMenu`  |             | `CustomEvent<any>` |
| `control:pause`             |             | `CustomEvent<any>` |
| `control:play`              |             | `CustomEvent<any>` |
| `control:seek`              |             | `CustomEvent<any>` |
| `control:unmute`            |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [xm-player](../player)

### Depends on

- [xm-settings-menu](../settings-menu)

### Graph
```mermaid
graph TD;
  xm-controls --> xm-settings-menu
  xm-player --> xm-controls
  style xm-controls fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
