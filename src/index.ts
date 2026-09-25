export interface OnMatchParams {
  /** `true` on the first `onMatch` call of this observer only. */
  firstTime: boolean;
}

export interface MediaQueryObserverOptions {
  /** The media query to observe, e.g. `'(max-width: 1024px)'`. */
  mediaQuery: string;
  /** Called when the query matches, at once for the current state and on every change. */
  onMatch?: (params: OnMatchParams) => void;
  /** Called when the query does not match, at once for the current state and on every change. */
  onUnmatch?: () => void;
}

interface MediaQueryChange {
  matches: boolean;
}

export default class MediaQueryObserver {
  #firstTime = true;

  #compatibilityMode = false;

  #isObserving = false;

  #mediaQueryList: MediaQueryList;

  #onMatch: ((params: OnMatchParams) => void) | null;

  #onUnmatch: (() => void) | null;

  constructor({ mediaQuery, onMatch, onUnmatch }: MediaQueryObserverOptions) {
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

  /** Resumes listening for changes. Does nothing while already observing. */
  startObserving(): void {
    if (this.#isObserving === false) {
      if (this.#compatibilityMode) {
        this.#mediaQueryList.addListener(this.#mediaQueryStatusMatchChanged);
      } else {
        this.#mediaQueryList.addEventListener('change', this.#mediaQueryStatusMatchChanged);
      }

      this.#isObserving = true;
    }
  }

  /** Stops listening for changes. Does nothing while stopped. */
  stopObserving(): void {
    if (this.#isObserving === true) {
      if (this.#compatibilityMode) {
        this.#mediaQueryList.removeListener(this.#mediaQueryStatusMatchChanged);
      } else {
        this.#mediaQueryList.removeEventListener('change', this.#mediaQueryStatusMatchChanged);
      }

      this.#isObserving = false;
    }
  }

  #mediaQueryStatusMatchChanged = ({ matches }: MediaQueryChange): void => {
    if (matches) {
      this.#execOnMatchCallback();
    } else {
      this.#execOnUnmatchCallback();
    }
  };

  #execOnMatchCallback = (): void => {
    if (this.#onMatch) {
      const firstTime = this.#firstTime;

      this.#firstTime = false;

      this.#onMatch.call(null, {
        firstTime,
      });
    }
  };

  #execOnUnmatchCallback = (): void => {
    if (this.#onUnmatch) {
      this.#onUnmatch.call(null);
    }
  };
}
