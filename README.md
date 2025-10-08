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

### Conventional Commits

This project uses conventional commit standards to maintain a clean and consistent git history.

#### Setup

To enable the commit message hook:

```bash
cp scripts/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

#### Usage

Commit messages must follow the format: `type: description` where:
- `type` is one of: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- The entire first line must be lowercase
- The first line must be ≤60 characters

Examples:
- `feat: add user authentication`
- `fix: resolve login bug`
- `docs: update readme`

#### History Cleanup

To clean up existing commit messages, use the `scripts/rewrite_msg.sh` script:

```bash
./scripts/rewrite_msg.sh <commit-hash>
```

This will rewrite the commit message to be lowercase and truncated to 60 characters.

### Contributing

To contribute, fork the repository, make changes, ensure tests pass, and submit a pull request. Maintain code quality.

### Security

Do not commit API keys. Use HTTPS. Keep dependencies updated. Adhere to AI usage policy.