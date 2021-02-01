import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';

import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'xmf',
  plugins: [sass(), postcss({ plugins: [autoprefixer()] })],
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  copy: [{ src: 'static' }],
  devServer: {
    // With HMR the `load` lifecycle event is triggered but not the `unload`
    // event. This will lead to non removing event listeners but only adding
    // more and more new listeners.
    //
    // See https://github.com/ionic-team/stencil/issues/1316
    //
    reloadStrategy: 'pageReload',
    openBrowser: false,
  },
  testing: (() => {
    switch (process.env.DEBUG) {
      case '1':
        return { browserHeadless: false, browserSlowMo: 2000 };
      default:
        return {};
    }
  })(),
};
