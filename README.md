# Xikolo Video Player

The Xikolo video player is designed to provide a better user experience when viewing videos in the Xikolo project.
It provides features to control basic video playback functions to watch videos hosted on different video providers.

Beyond that there are more features:

- Dual Stream mode (teacher view and slides) and the ability to resize streams
- Event API for analytics
- Theming
- Control any other function with a custom button, see [Toggle Control](#toggle-control)

## Getting Started

1. Clone the repository

```bash
git clone https://lab.xikolo.de/xikolo/video-player
cd video-player
```

2. Install the dependencies and run the project

```bash
npm install
npm start
```

A demo page will be available at `http://localhost:3333`.
Here you can manually test both the basic functions and the advanced features.
This page is automatically reloaded when you save a file with changes.

To run the tests, run:

```bash
npm test
```

## Example usage

A basic markup to get started may look like this:

```html
<xm-player>
  <xm-vimeo src="xxx" name="foo-stream"></xm-vimeo>
  <xm-presentation reference="foo-stream" name="single" label="Lecturer and slides (picture-in-picture)"><xm-presentation>
</xm-player>
```

## Video Providers

There is support for videos hosted on Vimeo and Kaltura.
The `name` property must match a `reference` property of a `xm-presentation`.

For more configuration, consult the documention of the `xm-vimeo` or `xm-kaltura` component.

## Presentation modes

At least one `xm-presentation` component is required.
The `reference` property must match the `name` property of a provider.
As of now, only one `xm-presentation` is supported so make sure to add the default mode first in the DOM.

For more configuration, consult the documention of the `xm-presentation` component.

## Theming

The video player is designed to support customization for key components.
You can override the following variables with your favorite colors or numbers:

```css
  --vp-slider-color
  --vp-gutter-color
  --vp-gutter-width
  --vp-main-color
  --vp-bg-color
  --vp-bg-color-rgb
  --vp-menu-color-rgb
  --vp-control-slider-height
```

## Toggle Control

The video player is capable to control components outside of itself.

To add a toggle you need to add a `<xm-toggle-control></xm-toggle-control>`-tag.

The `<xm-toggle-control>` must have a `name: string` as identifier.
The `name` must be **unique**.

Important here is, that the markup also contains a `slot`-Attribute with the **same name**.
A `title: string` is used for displaying a hover tooltip specified.
You also need a nested `<svg>` working as a symbol displayed in the controls on the bottom of the player.

On click the toggle control will emit an `control:changeToggleControlActiveState`-Event containing

```javascript
interface ToggleControlProps {
  name: string;
  title: string;
  active: boolean;
}
```

#### Example markup

```html
<xm-player id="player-with-custom-control">
  <xm-toggle-control
    slot="toggleControl"
    name="toggleControl"
    title="Custom Control"
    active
  >
    <svg slot="icon" viewBox="0 0 32 32" role="presentation" focusable="false">
      <path
        d="M0 2h32v4h-32zM0 8h20v4h-20zM0 20h20v4h-20zM0 14h32v4h-32zM0 26h32v4h-32z"
      ></path>
    </svg>
  </xm-toggle-control>
</xm-player>
```

#### Example control hook

```javascript
videoPlayerWithCustomControl.addEventListener(
  'control:changeToggleControlActiveState',
  (event) => {
    if (event.detail.name === 'toggleControl') {
      customControlledText.innerHTML = `The feature is ${
        event.detail.active ? ' active' : ' not active'
      }`;
    }
  }
);
```

## Development

The Xikolo Video Player is built with [Stencil JS](https://stenciljs.com).

Stencil is a compiler for building Web Components.
Think of it as an compile-time tool.
At run-time, the video player can be used like any standards-based Web Components.

### Naming Components

Components are prefixed with `xm-`.

### Event Naming Conventions

Internal events are prefixed depending on where they are emmitted from.
E.g. the `controls` component emits a `control:play`, the `settings-menu` a `setting:changePlaybackRate`.
They are intended for internal use, but are also used outside, e.g. for analytics tracking.

Events from the `player` component itself do not have a name prefix.
They are supposed to be only used externally.
E.g. `cueListChange`.

### Code Style

To organize the code structure, we follow the [proposed guideline by Stencil](https://stenciljs.com/docs/style-guide#code-organization).
The repo has a pre-push git hook with eslint so that new linter offenses do not end up in the code base.

### SVG Icons

SVG icons are taken from the Xikolo font and FontAwesome imported to [icomoon.io](https://icomoon.io).
You can easily export the icons as cleaned SVG from this page.
