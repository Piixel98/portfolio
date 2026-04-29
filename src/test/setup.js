import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe(element) {
    this.callback([{ isIntersecting: true, target: element }])
  }

  unobserve() {}

  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver
globalThis.IntersectionObserver = MockIntersectionObserver
