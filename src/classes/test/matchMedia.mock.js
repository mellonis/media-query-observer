export const addEventListenerMock = jest.fn();
export const removeEventListenerMock = jest.fn();
export const matchesGetterMock = jest.fn(() => false);

const mockImplementationProto = {
  addEventListener: addEventListenerMock,
  removeEventListener: removeEventListenerMock,
};

Object.defineProperty(mockImplementationProto, 'matches', {
  get: matchesGetterMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => (mockImplementationProto)),
});
