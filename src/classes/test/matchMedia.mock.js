export const addEventListenerMock = jest.fn();
export const removeEventListenerMock = jest.fn();
export const matchesGetterMock = jest.fn(() => false);

const qq = {
  addEventListener: addEventListenerMock,
  removeEventListener: removeEventListenerMock,
};

Object.defineProperty(qq, 'matches', {
  get: matchesGetterMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => (qq)),
});
