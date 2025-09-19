# Running Hub

## Quick Start

```bash
git clone <repository-url>
cd hub
npm install
cp .env.example .env   # Add your API keys
npm run dev
```

Frontend: `http://localhost:3000` | Backend: `http://localhost:3030`

## Prerequisites

- Node.js 18+
- npm or pnpm
- Git

## Environment Setup

Create `.env` file:

```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## Development

### Start Services
- **Full stack**: `npm run dev` or `pnpm dev`
- **Frontend only**: `npm start`
- **Backend only**: `npm run server`

### Testing
- **Unit tests**: `npm test`
- **E2E tests**: `npm run e2e`
- **Quality check**: `npm run check`

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables
3. Push to main branch for automatic deployment

### Manual
```bash
npm run build
npm run server
```

## Troubleshooting

### Port conflicts
```bash
echo "PORT=3031" >> .env
lsof -ti:3030 | xargs kill -9
```

### Build issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### E2E test setup
```bash
npx playwright install
```