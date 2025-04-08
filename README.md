# TypeScript Express Backend

A robust backend API built with TypeScript, Express, PostgreSQL, Prisma, and Docker.

## Features

- **OOP Architecture**: Organized using Object-Oriented Programming principles
- **TypeScript**: Type-safe code throughout the application
- **Express**: Fast, unopinionated, minimalist web framework for Node.js
- **PostgreSQL**: Powerful, open-source relational database
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript
- **Authentication & Authorization**: JWT-based auth system with role-based access control
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Advanced logging with Winston
- **Docker**: Containerized application with Docker Compose
- **Nginx**: Reverse proxy for API routing

## Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and adjust values
3. Run the application:

```bash
# Development mode
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev

# Docker mode
npm run docker:up
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (admin only)

## Project Structure

```
project-root/
├── src/                            # Source code
│   ├── api/                        # API modules
│   ├── config/                     # Configuration
│   ├── middleware/                 # Global middleware
│   ├── utils/                      # Utilities
│   └── ...
├── prisma/                         # Prisma ORM
├── docker/                         # Docker configuration
└── ...
```

## License

MIT