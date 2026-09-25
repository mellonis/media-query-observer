import { beforeAll, beforeEach, describe, expect, it, jest, test } from '@jest/globals';
import { addEventListenerMock, removeEventListenerMock, matchesGetterMock } from './matchMedia.mock';
import MediaQueryObserver, { type OnMatchParams } from '../..';

describe('constructor', () => {
  beforeAll(() => {
    addEventListenerMock.mockClear();
  });

  it('throws an exception on absent constructor parameter', () => {
    // @ts-expect-error: the constructor requires its options
    expect(() => new MediaQueryObserver()).toThrow();
  });

  it('throws an excetion on invalid on absent matchMedia parameter', () => {
    // @ts-expect-error: mediaQuery is required
    expect(() => new MediaQueryObserver({})).toThrow('mediaQuery should be a string');
  });

  it('doesn\'t throw exceptions because of undefined callbacks', () => {

    new MediaQueryObserver({
      mediaQuery: '',
    });

    const matchMediaListChangeEventListener = addEventListenerMock.mock.calls[0][1];

    expect(() => {
      matchMediaListChangeEventListener.call(null, {
        matches: true,
      });
      matchMediaListChangeEventListener.call(null, {
        matches: false,
      });
    })
      .not.toThrow();
  });
});

describe('start/stop observing', () => {
  let mqo: MediaQueryObserver;

  beforeEach(() => {
    addEventListenerMock.mockClear();
    removeEventListenerMock.mockClear();
    mqo = new MediaQueryObserver({
      mediaQuery: '',
    });
  });

  it('starts observing at instansiate', () => {
    expect(addEventListenerMock).toHaveBeenCalledTimes(1);
  });

  test('calling the startObserving method doesn\'t add multiple event listeners ', () => {
    mqo.startObserving();
    expect(addEventListenerMock).toHaveBeenCalledTimes(1);
  });

  it('stops observing after calling the stopObserving method', () => {
    mqo.stopObserving();
    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
  });

  test('calling the stopObserving method doesn\'t try to remove multiple event listeners ', () => {
    mqo.stopObserving();
    mqo.stopObserving();
    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
  });

  it('can stop and start observing again', () => {
    expect(addEventListenerMock).toHaveBeenCalledTimes(1);
    expect(removeEventListenerMock).toHaveBeenCalledTimes(0);

    mqo.stopObserving();

    expect(addEventListenerMock).toHaveBeenCalledTimes(1);
    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);

    mqo.startObserving();

    expect(addEventListenerMock).toHaveBeenCalledTimes(2);
    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
  });
});

describe('onMatch/onUnmatch callbacks', () => {
  const onMatchMock = jest.fn<(params: OnMatchParams) => void>();
  const onUnmatchMock = jest.fn<() => void>();
  let matchMediaListChangeEventListener: (change: { matches: boolean }) => void;

  beforeEach(() => {
    addEventListenerMock.mockClear();
    removeEventListenerMock.mockClear();
    matchesGetterMock.mockClear();


    new MediaQueryObserver({
      mediaQuery: '',
      // todo: remove wrappers, were added in order to pass instanceof test
      onMatch: (...args) => onMatchMock(...args),
      onUnmatch: (...args) => onUnmatchMock(...args),
    });

    onMatchMock.mockClear();
    onUnmatchMock.mockClear();


    matchMediaListChangeEventListener = addEventListenerMock.mock.calls[0][1];
  });

  test('correct callbacks calls count', () => {
    const counters = {
      match: 0,
      unmatch: 0,
    };
    const { fromCounters, fromMocks } = Array.from({ length: 10 })
      .map(() => Math.random() > 0.5)
      .reduce((result, matches) => {
        const { fromCounters: fromCountersLocal, fromMocks: fromMocksLocal } = result;

        if (matches) {
          counters.match += 1;
        } else {
          counters.unmatch += 1;
        }

        matchMediaListChangeEventListener.call(null, {
          matches,
        });

        fromCountersLocal.push([counters.match, counters.unmatch]);
        fromMocksLocal.push([onMatchMock.mock.calls.length, onUnmatchMock.mock.calls.length]);

        return result;
      }, {
        fromCounters: [] as number[][],
        fromMocks: [] as number[][],
      });

    expect(fromCounters).toEqual(fromMocks);
  });

  test('the firstTime property of onMatch parameter is correct', () => {
    [true, true].forEach((matches) => matchMediaListChangeEventListener.call(null, {
      matches,
    }));

    expect(onMatchMock.mock.calls.map(([params]) => params.firstTime)).toEqual([true, false]);
  });
});
