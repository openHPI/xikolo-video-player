/**
 * Fixes the "ReferenceError: regeneratorRuntime is not defined" error
 * The kaltura-player-js needs the same dependency
 * See: https://github.com/kaltura/kaltura-player-js/blob/master/package.json
 */
import 'regenerator-runtime/runtime';

import * as Core from '@playkit-js/playkit-js';

import * as Provider from '@playkit-js/ovp-provider/dist/ovp-provider';

export { Core, Provider };
