# xm-custom-control-button



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                         | Type      | Default     |
| -------- | --------- | ------------------------------------------------------------------- | --------- | ----------- |
| `active` | `active`  | Active state of toggle. Can function as on / off switch for feature | `boolean` | `undefined` |
| `name`   | `name`    | Reference to toggle control in EventListener and slot reference     | `string`  | `undefined` |
| `title`  | `title`   | Displays tooltip on hover                                           | `string`  | `undefined` |


## Events

| Event                  | Description                                                             | Type                              |
| ---------------------- | ----------------------------------------------------------------------- | --------------------------------- |
| `toggleControl:loaded` | Emitted on componentDidLoad. Used in player to init CustomControlButton | `CustomEvent<ToggleControlProps>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
