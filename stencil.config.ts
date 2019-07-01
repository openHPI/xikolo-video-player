import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';

import autoprefixer from 'autoprefixer';


export const config: Config = {
  namespace: 'xim',
  plugins: [
    sass(),
    postcss({
      plugins: [autoprefixer()]
    })
  ],
  outputTargets: [
    { type: 'dist',
      esmLoaderPath: '../loader'
    }, {
      type: 'docs-readme'
    }, {
      type: 'www',
      serviceWorker: null
    }
  ],
  copy: [
    { src: 'static' }
  ],
  devServer: {
    openBrowser: false
  },
};
