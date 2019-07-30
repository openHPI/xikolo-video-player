# video-player



<!-- Auto Generated Below -->


## Methods

### `pause() => Promise<void>`

hhhhf

#### Returns

Type: `Promise<void>`



### `play() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [xm-screen](../screen)
- [xm-controls](../controls)
- context-consumer

### Graph
```mermaid
graph TD;
  xm-player --> xm-screen
  xm-player --> xm-controls
  xm-player --> context-consumer
  xm-controls --> context-consumer
  style xm-player fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
