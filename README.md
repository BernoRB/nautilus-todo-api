# Nautilus TODO API

**[Ir a versión en Español](./README.es.md)**

RESTful API for task management with JWT authentication. Built as a technical assessment for a Node.js backend position.

## Stack

- **Runtime:** Node.js 18
- **Framework:** Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Testing:** Jest + Supertest
- **Containerization:** Docker + Docker Compose

## Getting Started

### Prerequisites

- Docker Desktop
- Git

### Installation and Setup
```bash
# Clone repository
git clone https://github.com/BernoRB/nautilus-todo-api.git
cd nautilus-todo-api

# Build and start services
docker-compose up --build

# The API will be available at http://localhost:3000
```

That's it. Docker handles Node.js, MongoDB, and all dependencies.

### Without Docker (Alternative)

If you prefer running locally:
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start MongoDB (must be running separately)

# Run development server
npm run dev
```

## Usage

### API Documentation

Swagger documentation available at:
- **Swagger UI:** http://localhost:3000/api-docs

### Quick Test
```bash
# Health check
curl http://localhost:3000/

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Use returned token for authenticated requests
```

### Postman Collection

Import the Postman collection from `/postman` directory for easy testing.

## Testing
```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

```

Tests use MongoDB Memory Server, so no external database is needed.

## Project Structure
```
src/
├── config/         # Configuration files (database, swagger)
├── controllers/    # Request handlers
├── middlewares/    # Custom middleware (auth, error handling)
├── models/         # Mongoose schemas
├── routes/         # Route definitions
├── services/       # Business logic layer
├── utils/          # Utilities (JWT)
└── validators/     # Input validation rules

tests/
├── unit/           # Unit tests
└── integration/    # Integration tests
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - List all tasks (filterable by `?completed=true|false`)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:taskNumber` - Get specific task
- `PATCH /api/tasks/:taskNumber` - Update task (for example to mark as completed)
- `DELETE /api/tasks/:taskNumber` - Delete task

All task endpoints require `Authorization: Bearer <token>` header.

## Some technical Decisions

### Service Layer
Business logic separated from HTTP handling. Controllers stay thin and focused on request/response, while services contain domain logic. This separation improves testability (services can be tested without mocking HTTP) and maintainability (clear responsibilities).

### Task Numbering
Tasks use auto-incremental `taskNumber` (1, 2, 3...) instead of MongoDB ObjectIds for user-friendly URLs. Each user has independent numbering.

### Docker
Single command to run the entire stack without installing Node.js or MongoDB locally.

## Environment Variables

Required variables (see `.env.example`):
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/nautilus-todo-api
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
```

**Note:** When using Docker, environment variables are pre-configured in `docker-compose.yml` for development. For production deployment, update these values with secure credentials.

## Docker Commands
```bash
# Start services
docker-compose up

# Rebuild after dependency changes
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f api```