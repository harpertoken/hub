# Harper

Harper is a versatile web application that brings together content creation, AI-powered tools, and educational resources in one seamless platform. Whether you're crafting posts, exploring AI capabilities, or diving into learning materials, Harper provides an intuitive and powerful experience.

<!-- Help needed -->

## Features

At its core, Harper offers robust post management with the ability to create, edit, and organize content effortlessly. The integrated AI Lab lets you analyze media, generate content, and leverage advanced AI models for creative and analytical tasks. For learning enthusiasts, the platform includes comprehensive educational resources and a detailed cookbook filled with practical guides and recipes across various domains. Diagnostic tools help monitor system performance, while persistent audio playback ensures uninterrupted listening experiences. The app is built with modern web technologies, featuring a responsive design that works beautifully on all devices. Real-time updates, rich media support, and accessibility-focused components make it both powerful and user-friendly.

## Getting Started

Prerequisites include Node.js version 18 or higher, and npm or pnpm package manager. To install, first clone the repository, then cd into the project directory. Next, install the dependencies using npm install or pnpm install if you prefer pnpm. After that, set up your environment variables by copying the example file with cp .env.example .env, and then edit the .env file with your actual API keys and configuration. Start the development server by running npm start. For the full experience, run the backend server in a separate terminal with npm run server.

Once everything is set up, you can create your first post by clicking the New button, explore AI features in the AI Lab section, browse educational content and recipes, and customize settings to your preferences.

## Tech Stack

Harper is built using a modern technology stack that includes React 18 with hooks and functional components, React Router for smooth navigation, Tailwind CSS for styling with custom themes, Express.js backend with Firebase integration, Google Generative AI for AI-powered features, Cloudinary for media management, Radix UI and Lucide React for polished UI components, and Framer Motion for smooth animations.

## Development

To contribute or modify the codebase, run npm run dev to start both frontend and backend in development mode, use npm run build to create a production build, and execute npm test to run the test suite.

## Deployment

The application is ready for deployment on Vercel. The vercel.json file contains the necessary configuration. Make sure to set all required environment variables in your deployment platform.

## Contributing

We welcome contributions! Here's how you can help: fork the repository, create a feature branch for your changes, make your modifications, test thoroughly and ensure code quality, and submit a pull request with a clear description.

## Security & Best Practices

Never commit API keys or sensitive information, always use HTTPS in production environments, keep dependencies updated for security patches, and review the AI Usage Policy for responsible AI implementation.

## License

This project is licensed under the terms specified in the LICENSE file.