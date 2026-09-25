import { jest } from '@jest/globals';
type Listener = (change: { matches: boolean }) => void;

export const addEventListenerMock = jest.fn<(type: string, listener: Listener) => void>();
export const removeEventListenerMock = jest.fn<(type: string, listener: Listener) => void>();
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
