# media-query-observer

[![Node.js CI](https://github.com/mellonis/media-query-observer/actions/workflows/main.yml/badge.svg)](https://github.com/mellonis/media-query-observer/actions/workflows/main.yml)
[![Coverage Status](https://coveralls.io/repos/github/mellonis/media-query-observer/badge.svg?branch=master)](https://coveralls.io/github/mellonis/media-query-observer?branch=master)
[![npm](https://img.shields.io/npm/v/media-query-observer)](https://www.npmjs.com/package/media-query-observer)

🖥👀 Run a callback when a CSS media query starts or stops matching.

A small wrapper over `window.matchMedia` that calls `onMatch` / `onUnmatch` for
the current state at once and again on every change, and falls back to the
legacy `addListener` / `removeListener` API in browsers that lack
`addEventListener` on `MediaQueryList`.

## Install

```sh
npm install media-query-observer
```

## Usage

```javascript
import MediaQueryObserver from 'media-query-observer';

const observer = new MediaQueryObserver({
  mediaQuery: '(max-width: 1024px)',
  onMatch: ({ firstTime }) => console.log('matches', { firstTime }),
  onUnmatch: () => console.log('does not match'),
});

// later
observer.stopObserving();
observer.startObserving();
```

## API

### `new MediaQueryObserver({ mediaQuery, onMatch, onUnmatch })`

| Option | Type | Description |
| --- | --- | --- |
| `mediaQuery` | `string` | The media query to observe. A non-string throws a `TypeError`. |
| `onMatch` | `({ firstTime: boolean }) => void` | Optional. Called when the query matches. `firstTime` is `true` on the first call only. |
| `onUnmatch` | `() => void` | Optional. Called when the query does not match. |

The constructor calls the callback for the current state right away and starts
observing.

### `startObserving()`

Resumes listening for changes. Calling it while already observing does nothing.

### `stopObserving()`

Stops listening for changes. Calling it while stopped does nothing.

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge 15+ | 6+ | 36+ | 8+ | 23+ |

## Development

Requires Node.js 20 or newer.

```sh
npm install
npm run lint
npm test               # or test:watch, test:coverage
npm run build          # lint + test + rollup → dist/index.js
```

## License

MIT
