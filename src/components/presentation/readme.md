# xm-presentation

This component is required to configure the video player in different presentation modes.

There are two options:

- Display a single video
- Display two videos side-by-side, separated by a gutter to resize the screens

As of now, there can only be one configuration.
Make sure you put the default presentation mode first in the DOM.
In an upcoming update, the user will be able to switch between these presentation modes.

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                                                                                                                                                                                    | Type     | Default     |
| ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `label`     | `label`     | Label for button shown in the settings                                                                                                                                                                                                                         | `string` | `undefined` |
| `name`      | `name`      | Internal name property Must be unique                                                                                                                                                                                                                          | `string` | `undefined` |
| `reference` | `reference` | Comma separated-string to define video sources to load. These are displayed in the specified order in the player.  For example: `reference='source-a,source-b'` will result in a primary video rendering source-a and a secondary screen will render source-b. | `string` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
