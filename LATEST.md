# Testing Setup

## Commands

```bash
npm test                    # Run tests (watch mode)
npm test -- --watchAll=false # Run tests once
npm run test -- --coverage  # Run with coverage
npm run check              # Full check (lint + build + test)
npm run lint               # Lint only
npm run build              # Build only
```

## Configuration

Jest config in `package.json` handles ES modules with:
- `transformIgnorePatterns` for packages that need transformation
- `moduleNameMapper` for mocked dependencies

## Mock Files

Created in `src/__mocks__/`:
- `remark-math.js`
- `rehype-katex.js`
- `react-syntax-highlighter.js`
- `prism-styles.js`
- `unist-util-visit-parents.js`
- `remark-gfm.js`
- `rehype-raw.js`

## Test Example

```javascript
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});
```

## Recent Changes

- Fixed Jest ES module issues
- Added mocking for markdown libraries
- Suppressed deprecation warnings
- Enabled coverage reporting