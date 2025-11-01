# LMS Admin Portal

This is a [Next.js](https://nextjs.org) project for the Learning Management System Admin Portal, providing administrative and super-admin capabilities.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Admin Features
- User management and account administration
- Enrollment management and tracking
- Course oversight and monitoring
- System analytics and reporting
- Support functions

### Super Admin Features
- Cross-organization access and management
- System-wide platform oversight
- Organization management and configuration
- Global user and course management
- Platform analytics and health monitoring

## Documentation

- [Admin Journey](/docs/ADMIN_JOURNEY.md) - Comprehensive guide to administrator experience
- [Super Admin Journey](/docs/SUPER_ADMIN_JOURNEY.md) - Complete super admin guide
- [Login Flow](/SUPER_ADMIN_LOGIN_FLOW.md) - Authentication and login process

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI
- **State Management**: Zustand, React Query
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Project Structure

```
lms-admin/
├── src/
│   ├── app/                  # Next.js pages
│   │   ├── admin/           # Admin login
│   │   └── super-admin/     # Super admin dashboard & pages
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── super-admin/    # Super admin components
│   │   ├── shared/         # Shared components
│   │   └── ui/             # UI primitives
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilities and API client
├── docs/                   # Documentation
└── public/                 # Static assets
```

## API Configuration

The application connects to the LMS backend API. Configure the API base URL using environment variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://lms-backend-k5t6.onrender.com
NEXT_PUBLIC_API_VERSION=v1
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy

The easiest way to deploy this Next.js app is using [Vercel Platform](https://vercel.com/new).

