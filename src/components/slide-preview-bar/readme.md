# xm-slide-preview-bar



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                        | Default     |
| ----------- | ------------ | ----------- | --------------------------- | ----------- |
| `duration`  | `duration`   |             | `number`                    | `undefined` |
| `onSeek`    | --           |             | `(seconds: number) => void` | `undefined` |
| `slidesSrc` | `slides-src` |             | `string`                    | `undefined` |


## Dependencies

### Used by

 - [xm-slider](../slider)

### Depends on

- [xm-tooltip](../tooltip)

### Graph
```mermaid
graph TD;
  xm-slide-preview-bar --> xm-tooltip
  xm-slider --> xm-slide-preview-bar
  style xm-slide-preview-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
