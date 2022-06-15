# xm-slider



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description | Type       | Default     |
| ------------ | ------------ | ----------- | ---------- | ----------- |
| `duration`   | `duration`   |             | `number`   | `undefined` |
| `fullscreen` | `fullscreen` |             | `boolean`  | `undefined` |
| `progress`   | --           |             | `Progress` | `undefined` |
| `slidesSrc`  | `slides-src` |             | `string`   | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `slider:seek` |             | `CustomEvent<any>` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"slider"` |             |


## Dependencies

### Used by

 - [xm-controls](../controls)

### Depends on

- [xm-slide-preview-bar](../slide-preview-bar)
- [xm-tooltip](../tooltip)

### Graph
```mermaid
graph TD;
  xm-slider --> xm-slide-preview-bar
  xm-slider --> xm-tooltip
  xm-slide-preview-bar --> xm-tooltip
  xm-controls --> xm-slider
  style xm-slider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
