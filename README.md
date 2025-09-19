# Hub

[![🧪 E2E Tests](https://github.com/harpertoken/hub/actions/workflows/e2e.yml/badge.svg)](https://github.com/harpertoken/hub/actions/workflows/e2e.yml)

A platform for content creation and learning.

### Features

- Create and manage posts
- AI Lab for content generation and media analysis
- Educational resources and cookbook
- Persistent audio player
- Responsive design for all devices
- Real-time updates

### Quick Start

Requires Node.js 18+ and npm or pnpm.

```bash
git clone https://github.com/harpertoken/hub.git
cd hub
npm install
cp .env.example .env
# edit .env with your keys
npm start
npm run server  # in another terminal
```

After setup, navigate to the application to create your first post.

### Technology Stack

- React 18 with hooks
- Express backend
- Firebase and Google AI
- Tailwind CSS
- Configured for Vercel deployment

### Development Commands

```bash
npm run dev    # start both frontend and backend
npm run build  # production build
npm test       # run tests
```

### Deployment

Configured for deployment on Vercel. Push changes to the main branch for automatic deployment. Configure environment variables in the Vercel dashboard.

### Contributing

To contribute, fork the repository, make changes, ensure tests pass, and submit a pull request. Maintain code quality.

### Security

Do not commit API keys. Use HTTPS. Keep dependencies updated. Adhere to AI usage policy.