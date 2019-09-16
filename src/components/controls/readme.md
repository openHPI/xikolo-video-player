# xm-controls



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `status` | --        |             | `Status` | `undefined` |


## Events

| Event                     | Description | Type               |
| ------------------------- | ----------- | ------------------ |
| `control:enterFullscreen` |             | `CustomEvent<any>` |
| `control:exitFullscreen`  |             | `CustomEvent<any>` |
| `control:pause`           |             | `CustomEvent<any>` |
| `control:play`            |             | `CustomEvent<any>` |
| `control:seek`            |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [xm-player](../player)

### Graph
```mermaid
graph TD;
  xm-player --> xm-controls
  style xm-controls fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
