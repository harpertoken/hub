# Running hub

## Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Environment Variables
Create a `.env` file in the root directory with:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_key (optional)
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id (optional)
```

## Starting the Application

### Frontend Only
```bash
npm start
```
Starts React dev server on http://localhost:3000

### Backend Only
```bash
npm run server
```
Starts Express server on port 3030

### Both Frontend and Backend
```bash
npm run dev
```
Runs both concurrently using concurrently

## Stopping the Application

### Development Server
In the terminal running the server, press:
```
Ctrl+C
```

### Background Processes
If running in background, kill the processes:
```bash
# Kill React dev server
pkill -f "react-scripts start"

# Kill backend server
pkill -f "node src/server/index.js"
```

### Check Running Processes
```bash
# See Node processes
ps aux | grep node

# Kill by PID
kill <PID>
```

## Production Build

```bash
npm run build
```
Creates optimized build in `build/` directory

## Deployment

The app is configured for Vercel deployment. Push to main branch to trigger deployment.

## Troubleshooting

- Port conflicts: Change PORT in .env
- API errors: Check environment variables
- Build fails: Clear node_modules and reinstall

## Scripts Available

- `npm start` - Start frontend dev server
- `npm run build` - Create production build
- `npm run server` - Start backend server
- `npm run dev` - Start both frontend and backend
- `npm test` - Run tests
- `npm run lint` - Run ESLint