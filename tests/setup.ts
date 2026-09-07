import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti in test environment
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
  create: vi.fn(() => vi.fn()),
}));

// Polyfill localStorage in test environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    writable: true,
  });
}
