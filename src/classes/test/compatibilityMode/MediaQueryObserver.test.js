import { addListenerMock, removeListenerMock, matchesGetterMock } from './matchMedia.mock';
import MediaQueryObserver from '../../MediaQueryObserver';

describe('start/stop observing', () => {
  let mqo;

  beforeEach(() => {
    addListenerMock.mockClear();
    removeListenerMock.mockClear();
    mqo = new MediaQueryObserver({
      mediaQuery: '',
    });
  });

  it('starts observing at instansiate', () => {
    expect(addListenerMock).toBeCalledTimes(1);
  });

  test('calling the startObserving method doesn\'t add multiple event listeners ', () => {
    mqo.startObserving();
    expect(addListenerMock).toBeCalledTimes(1);
  });

  it('stops observing after calling the stopObserving method', () => {
    mqo.stopObserving();
    expect(removeListenerMock).toBeCalledTimes(1);
  });

  test('calling the stopObserving method doesn\'t try to remove multiple event listeners ', () => {
    mqo.stopObserving();
    mqo.stopObserving();
    expect(removeListenerMock).toBeCalledTimes(1);
  });

  it('can stop and start observing again', () => {
    expect(addListenerMock).toBeCalledTimes(1);
    expect(removeListenerMock).toBeCalledTimes(0);

    mqo.stopObserving();

    expect(addListenerMock).toBeCalledTimes(1);
    expect(removeListenerMock).toBeCalledTimes(1);

    mqo.startObserving();

    expect(addListenerMock).toBeCalledTimes(2);
    expect(removeListenerMock).toBeCalledTimes(1);
  });
});

describe('onMatch/onUnmatch callbacks', () => {
  const onMatchMock = jest.fn();
  const onUnmatchMock = jest.fn();
  let matchMediaListChangeEventListener;

  beforeEach(() => {
    addListenerMock.mockClear();
    removeListenerMock.mockClear();
    matchesGetterMock.mockClear();

    // eslint-disable-next-line no-new
    new MediaQueryObserver({
      mediaQuery: '',
      // todo: remove wrappers, were added in order to pass instanceof test
      onMatch: (...args) => onMatchMock(...args),
      onUnmatch: (...args) => onUnmatchMock(...args),
    });

    onMatchMock.mockClear();
    onUnmatchMock.mockClear();

    // eslint-disable-next-line prefer-destructuring
    matchMediaListChangeEventListener = addListenerMock.mock.calls[0][0];
  });

  test('correct callbacks calls count', () => {
    const counters = {
      match: 0,
      unmatch: 0,
    };
    const { fromCounters, fromMocks } = [...new Array(10)]
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
        fromCounters: [],
        fromMocks: [],
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
