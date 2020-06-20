/* eslint-disable no-trailing-spaces */
export default class MediaQueryObserver {
  #firstTime = true

  #isObserving = false

  #mediaQueryList

  #onMatch

  #onUnmatch

  constructor({ mediaQuery, onMatch, onUnmatch }) {
    this.#mediaQueryList = window.matchMedia(mediaQuery);

    if (typeof mediaQuery !== 'string') {
      throw new TypeError('mediaQuery should be a string');
    }

    this.#onMatch = (onMatch instanceof Function) ? onMatch : null;
    this.#onUnmatch = (onUnmatch instanceof Function) ? onUnmatch : null;

    this.#mediaQueryStatusMatchChanged({
      matches: this.#mediaQueryList.matches,
    });
    this.startObserving();
  }

  startObserving() {
    if (this.#isObserving === false) {
      this.#mediaQueryList.addEventListener('change', this.#mediaQueryStatusMatchChanged);
      this.#isObserving = true;
    }
  }

  stopObserving() {
    if (this.#isObserving === true) {
      this.#mediaQueryList.removeEventListener('change', this.#mediaQueryStatusMatchChanged);
      this.#isObserving = false;
    }
  }

  #mediaQueryStatusMatchChanged = function mediaQueryStatusMatchChanged({ matches }) {
    if (matches) {
      this.#execOnMacthCallback();
    } else {
      this.#execOnUnmatchCallback();
    }
  }.bind(this);

  // todo: (mellonis) use shorthand syntax in the future
  #execOnMacthCallback = function execOnMacthCallback() {
    if (this.#onMatch) {
      const firstTime = this.#firstTime;

      this.#firstTime = false;

      this.#onMatch.call(null, {
        firstTime,
      });
    }
  }

  // todo: (mellonis) use shorthand syntax in the future
  #execOnUnmatchCallback = function execOnUnmatchCallback() {
    if (this.#onUnmatch) {
      this.#onUnmatch.call(null);
    }
  }
}
