export const addListenerMock = jest.fn();
export const removeListenerMock = jest.fn();
export const matchesGetterMock = jest.fn(() => false);

const mockImplementationProto = {
  addListener: addListenerMock,
  removeListener: removeListenerMock,
};

Object.defineProperty(mockImplementationProto, 'matches', {
  get: matchesGetterMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => (mockImplementationProto)),
});
