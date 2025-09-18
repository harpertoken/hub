import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from './App';

// Mock react-markdown to avoid ES module issues
jest.mock('react-markdown', () => {
  return ({ children }) => <div>{children}</div>;
});

// Mock remark-math
jest.mock('remark-math', () => ({
  default: () => ({}),
}));

// Mock rehype-katex
jest.mock('rehype-katex', () => ({
  default: () => ({}),
}));

// Mock react-syntax-highlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => <pre>{children}</pre>,
}));

// Mock react-syntax-highlighter styles
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneLight: {},
}));

test('renders app without crashing', () => {
  // Suppress the specific deprecation warning
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('ReactDOMTestUtils.act')) {
      return;
    }
    originalError.call(console, ...args);
  };

  render(<App />);

  // Restore console.error
  console.error = originalError;

  // Basic test to ensure app renders
  expect(document.body).toBeInTheDocument();
});