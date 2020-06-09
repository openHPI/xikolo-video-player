![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Xikolo Media Player

TODO: Description

## Getting Started

Clone repository

```bash
git clone https://git@dev.xikolo.de:jgraichen/video-player-stencil
cd video-player-stencil
```

and run:

```bash
npm install
npm start
```

You can open a demo page on http://localhost:3333 now. This page is automatically reloaded with newly code when you save a file.

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```

## Development

The Xikolo Media Player is build with [Stencil JS](https://stenciljs.com).

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

### Naming Components

Components are named `xm-*`.

### SVG Icons

SVG icons are taken from the xikolo font and FontAwesome which are imported to [icomoon.io](https://icomoon.io). From there you can easily export them as cleaned SVG.

### Branding

The video player needs to support simple color customization. Components should use `currentColor` and custom CSS variables if appropriate.



## Hint for deploying

At the moment we have to copy&paste the dist and loader folder manually from the master branch to update the build branch.
To generate the needed files you can run the following comand:

```bash
npm run build
```


## Deploying

If the build branch should get a new stable version you have to give it a new tag:

```bash
git checkout build
git fetch
git pull
git tag -a v1.0.1 -m 'version 1.0.1'
git push --tags
```

After that you can use it as a git dependency in other projects like openHPI with the following command or add it manually.

With yarn (we use yarn at openHPI):
```bash
yarn add git+https://gitlab+deploy-token-<TOKEN_NUMBER>:<PASSWORD>@dev.xikolo.de/gitlab/xikolo/video-player#semver:<semver>


```

With npm:
```bash
npm install git+https://gitlab+deploy-token-<TOKEN_NUMBER>:<PASSWORD>@dev.xikolo.de/gitlab/xikolo/video-player#semver:<semver>
```

If you already have it installed, then you only have to update the semver in your package.json:

```bash
"dependencies": {
    ...
    "@xikolo/video-player2019": "git+https://gitlab+deploy-token-<TOKEN_NUMBER>:<PASSWORD>@dev.xikolo.de/gitlab/xikolo/video-player#semver:v1.0.1",
    ...
  },
```
