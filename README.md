# Study Companion Web (Frontend)

Welcome to the frontend codebase for **Study Companion** – a modern web application to help you organize, track, and enhance your study sessions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Study Companion** is a Next.js + TypeScript web app designed to help students and learners manage their studies efficiently. The frontend provides a sleek and intuitive interface for tracking progress, accessing learning resources, and planning study schedules. It integrates with a Django backend for authentication and data management.

## Features

- **Authentication**: Register, login, and manage user profiles securely.
- **Room & Topic Management**: Create, edit, and delete study rooms and topics.
- **Messaging**: Participate in room conversations, send and delete messages.
- **User Activity Feed**: View your activity and the activity of others.
- **Search**: Search for topics and rooms.
- **Profile Management**: Update your user profile and view others' profiles.
- **Responsive UI**: Modern, mobile-friendly design with reusable components.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- [Django REST API](https://www.django-rest-framework.org/) (backend, not included here)
- [ESLint](https://eslint.org/) (code linting)

## Folder Structure

```
studycomp/
├── app/                # Next.js app directory (routing, layouts, pages)
│   ├── activity/           # Activity feed page
│   ├── create-room/        # Create new room page
│   ├── delete-message/     # Delete message confirmation
│   ├── delete-room/        # Delete room confirmation
│   ├── delete-room-message/# Delete room message confirmation
│   ├── edit-room/          # Edit room page
│   ├── login/              # Login page
│   ├── profile/            # User profile pages
│   ├── register/           # Registration page
│   ├── room/               # Room conversation pages
│   ├── search-topics/      # Search topics page
│   ├── update-user/        # Update user profile page
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Main landing page
│
├── components/         # Reusable React components
│   ├── activity/           # Activity feed components
│   ├── feed/               # Feed display components
│   ├── message-form/       # Message form components
│   ├── navbar/             # Navigation bar
│   ├── room-conversation/  # Room conversation UI
│   ├── room-form/          # Room creation/editing
│   ├── room-participants/  # Room participants list
│   ├── topics/             # Topics list and UI
│   ├── user-activity/      # User activity components
│   └── user-feed/          # User feed components
│
├── context/             # React context (e.g., authentication)
│   └── auth.tsx
│
├── lib/                 # Utility libraries (API, validation)
│   ├── api.ts               # API helper functions
│   └── validation.ts        # Form validation logic
│
├── public/              # Static assets (images, icons, SVGs)
│   ├── images/              # User avatars, logos, etc.
│   └── icons/               # SVG icon files
│
├── styles/              # Global and form styles (CSS)
│   ├── form-validation.css
│   └── style.css
│
├── test.html            # (Optional) Test HTML file
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── next.config.ts       # Next.js configuration
├── eslint.config.mjs    # ESLint configuration
└── README.md            # Project documentation
```

## Getting Started

To run the project locally:

```bash
# Install dependencies
npm install
# Start the development server
npm run dev

# Or using yarn
yarn install
yarn dev

# Or using pnpm
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Environment Variables

Create a `.env.local` file in the root directory and set the following variable to connect to your Django backend:

```
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000/
```

## Available Scripts

- `dev`: Runs the app in development mode.
- `build`: Builds the production application.
- `start`: Starts the built app in production mode.
- `lint`: Runs ESLint to check for code issues.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to help with features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

*This project was bootstrapped with [Create Next App](https://nextjs.org/docs/app/api-reference/cli/create-next-app).*
