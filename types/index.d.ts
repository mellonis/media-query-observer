// CommonJS typings: `require('media-query-observer')` returns the class itself
// (with a `default` property pointing back at it), which only `export =` can
// describe. The declarations themselves come from the ES module typings.
import type * as M from './index.mjs' with { 'resolution-mode': 'import' };

declare const MediaQueryObserver: typeof M.default & { default: typeof M.default };
type MediaQueryObserver = M.default;
declare namespace MediaQueryObserver {
  type MediaQueryObserverOptions = M.MediaQueryObserverOptions;
  type OnMatchParams = M.OnMatchParams;
}

export = MediaQueryObserver;
