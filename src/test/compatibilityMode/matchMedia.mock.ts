import { jest } from '@jest/globals';
type Listener = (change: { matches: boolean }) => void;

export const addListenerMock = jest.fn<(listener: Listener) => void>();
export const removeListenerMock = jest.fn<(listener: Listener) => void>();
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
