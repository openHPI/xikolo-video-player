![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Xikolo Video Player

This video player will replace the currently used Vimeo video player for the Xikolo project.

More details will follow...

## Getting Started

1. Clone the repository
```bash
git clone https://git@dev.xikolo.de:jgraichen/video-player-stencil
cd video-player-stencil
```

2. Install the depencencies and run the project
```bash
npm install
npm start
```

The demo page will then be available on http://localhost:3333.
This page is reloaded automatically when saving a file with changes.

To run the (unit) tests, run:

```bash
npm test
```


## Development

The Xikolo Video Player is built with [Stencil JS](https://stenciljs.com).

Stencil is a compiler for building fast web apps using Web Components.
It combines concepts of the most popular frontend frameworks into a compile-time rather than a run-time tool.
Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

### Naming Components

Components are named `xm-*`.

### SVG Icons

SVG icons are taken from the Xikolo font and FontAwesome imported to [icomoon.io](https://icomoon.io).
You can easily export the icons as cleaned SVG from this page.

### Branding

The video player is designed to support simple color customization.
Components should use `currentColor` and custom CSS variables if appropriate.


## Deploying

For deploying the video player, please follow these steps.

Currently, the `build` branch contains the compiled build files.
The video player can be included as git dependency from this branch (see below).

1. Cleanup the project: remove the `dist` and `loader` folders

```bash
rm dist loader
```

2. When you have completed your changes and added them to `master`, build the project for production (in the `master` branch).

```bash
npm run build
```

3. Checkout the `build` branch and add your changes.
Please adhere to [Semantic Versioning](https://semver.org/) for annotating your changes and add a short summary to the commit message.

```bash
git checkout build
git pull --rebase
# Example for a commit message (not showing the summary of the changes)
git commit -m "Add changes from master (v1.x.x)"
```

4. The video player can be included in your project as a git dependency.

```bash
# Using yarn
yarn add git+https://gitlab+deploy-token-<TOKEN_NUMBER>:<PASSWORD>@dev.xikolo.de/gitlab/xikolo/video-player#semver:<semver>
# Using npm
npm install git+https://gitlab+deploy-token-<TOKEN_NUMBER>:<PASSWORD>@dev.xikolo.de/gitlab/xikolo/video-player#semver:<semver>
```

5. If it has already been added to your project, update it in your project.

```bash
# Example for the Xikolo project (using Yarn)
yarn upgrade @xikolo/video-player2019
```
