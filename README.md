# hub

[![CI](https://github.com/harpertoken/hub/actions/workflows/ci.yml/badge.svg)](https://github.com/harpertoken/hub/actions/workflows/ci.yml)

Content creation and learning platform.

<!-- Help needed -->

### What it does

- Create and manage posts
- AI Lab for content generation and media analysis
- Educational resources and cookbook
- Audio player that keeps going
- Works on all devices
- Real-time updates

### Quick start

Need Node.js 18+ and npm/pnpm.

```bash
git clone https://github.com/harpertoken/hub.git
cd hub
npm install
cp .env.example .env
# edit .env with your keys
npm start
npm run server  # in another terminal
```

Done. Click "New" to make your first post.

### Tech

- React 18 + hooks
- Express backend
- Firebase + Google AI
- Tailwind CSS
- Vercel ready

### Dev commands

```bash
npm run dev    # start both frontend/backend
npm run build  # production build
npm test       # run tests
```

### Deploy

Ready for Vercel. Just push and deploy. Set your env vars in Vercel dashboard.

### Contribute

Fork, make changes, test, PR. Keep it clean.

### Security

Don't commit API keys. Use HTTPS. Keep deps updated. Follow AI policy.

#