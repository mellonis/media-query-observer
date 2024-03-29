export default class MediaQueryObserver {
  #firstTime = true

  #compatibilityMode = false

  #isObserving = false

  #mediaQueryList

  #onMatch

  #onUnmatch

  constructor({ mediaQuery, onMatch, onUnmatch }) {
    this.#mediaQueryList = window.matchMedia(mediaQuery);

    if (!this.#mediaQueryList.addEventListener) {
      this.#compatibilityMode = true;
    }

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
      if (this.#compatibilityMode) {
        this.#mediaQueryList.addListener(this.#mediaQueryStatusMatchChanged);
      } else {
        this.#mediaQueryList.addEventListener('change', this.#mediaQueryStatusMatchChanged);
      }

      this.#isObserving = true;
    }
  }

  stopObserving() {
    if (this.#isObserving === true) {
      if (this.#compatibilityMode) {
        this.#mediaQueryList.removeListener(this.#mediaQueryStatusMatchChanged);
      } else {
        this.#mediaQueryList.removeEventListener('change', this.#mediaQueryStatusMatchChanged);
      }

      this.#isObserving = false;
    }
  }

  #mediaQueryStatusMatchChanged = ({ matches }) => {
    if (matches) {
      this.#execOnMatchCallback();
    } else {
      this.#execOnUnmatchCallback();
    }
  };

  #execOnMatchCallback = () => {
    if (this.#onMatch) {
      const firstTime = this.#firstTime;

      this.#firstTime = false;

      this.#onMatch.call(null, {
        firstTime,
      });
    }
  }

  #execOnUnmatchCallback = () => {
    if (this.#onUnmatch) {
      this.#onUnmatch.call(null);
    }
  }
}
