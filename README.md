![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Xikolo Video Player

This video player is used to provide a better user experience when viewing videos in the Xikolo project.
It provides features to control all basic video playback functions to control videos hosted on Vimeo.

The feature set includes more than the usual

- Dual Stream mode (teacher view and slides) and the ability to resize streams
- Event API for analytics
- Branding
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

The demo page will then be available on http://localhost:3333.
This page is reloaded automatically when saving a file with changes.

To run the tests, run:

```bash
npm test
```

## Example usage

### Embedding the video player

A very basic markup to get started may look like this:

```html
<xm-player>
  <xm-vimeo slot="primary" src="340196868"></xm-vimeo>
</xm-player>
```

### Branding

The video player is designed to support color customization for key components.
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

Components should use `currentColor` and custom CSS variables if appropriate.

### Toggle Control

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

## Contributing to the project

### Development

The Xikolo Video Player is built with [Stencil JS](https://stenciljs.com).

Stencil is a compiler for building fast web apps using Web Components.
It combines concepts of the most popular frontend frameworks into a compile-time rather than a run-time tool.
Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

### Naming Components

Components are named `xm-*`.

### Event Naming Conventions

Internal events are prefixed depending on where they come from.
E.g. the `controls` component emits a `control:play`, the `settings-menu` a `setting:changePlaybackRate`.
They are intended for internal use, but are also used outside, e.g. for tracking.

Events from the `player` component itself do not have a name prefix.
They are supposed to be only used externally.
E.g. `cueListChange`.

### Code Style

To organize the code structure, we follow the [proposed guideline by Stencil](https://stenciljs.com/docs/style-guide#code-organization).
The repo has a pre-push git hook with eslint so that new linter offenses do not end up in the code base.

### SVG Icons

SVG icons are taken from the Xikolo font and FontAwesome imported to [icomoon.io](https://icomoon.io).
You can easily export the icons as cleaned SVG from this page.

### Deploying

Commits to the `master` branch are automatically compiled and added to the `build` branch.

This branch can be used as a target for inclusion in other projects:

```bash
# Example for the Xikolo project (using Yarn)
yarn upgrade @xikolo/video-player2019
```
