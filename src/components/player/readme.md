# video-player



<!-- Auto Generated Below -->


## Methods

### `pause() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `play() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `seek(seconds: number) => Promise<void>`



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
  style xm-player fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
