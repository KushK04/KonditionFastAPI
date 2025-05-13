# Kondition Documentation Index

Welcome to the Kondition fitness motivator application documentation. This index provides links to all documentation resources for the project.

## Overview Documents

- [README.md](README.md) - Project overview, tech stack, and high-level architecture
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development setup, coding standards, and workflow
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions, environment configuration, and monitoring
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Detailed API endpoints, request/response formats, and authentication

## Frontend Documentation

- [KonditionExpo/README.md](KonditionExpo/README.md) - React Native/Expo frontend documentation

## Backend Documentation

- [backend/README.md](backend/README.md) - FastAPI backend documentation

## Quick Start Guides

### For Developers

1. **Clone the repository**

```bash
git clone <repository-url>
cd PROJECT/KonditionFastAPI
```

2. **Set up the backend**

```bash
# Create a virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Run migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

3. **Set up the frontend**

```bash
# Navigate to the Expo app directory
cd ../KonditionExpo

# Install dependencies
npm install

# Start the development server
npm start
```

### For Deployment

1. **Configure environment variables**

Create a `.env` file in the project root with the necessary configuration.

2. **Deploy with Docker Compose**

```bash
docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d
```

3. **Run migrations**

```bash
docker-compose exec backend alembic upgrade head
```

## Project Structure

```
PROJECT/KonditionFastAPI/
├── backend/                # FastAPI backend
│   ├── app/                # Main application package
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   └── tests/          # Test suite
│   ├── Dockerfile          # Docker configuration
│   └── README.md           # Backend documentation
├── KonditionExpo/          # React Native/Expo frontend
│   ├── app/                # Main application screens
│   ├── components/         # Reusable UI components
│   ├── assets/             # Static assets
│   └── README.md           # Frontend documentation
├── docker-compose.yml      # Docker Compose configuration
├── README.md               # Project overview
├── DEVELOPMENT.md          # Development guide
├── DEPLOYMENT.md           # Deployment guide
└── API_DOCUMENTATION.md    # API documentation
```

## Key Features

- **User Authentication**: Secure login and registration
- **Workout Tracking**: Log and monitor workout sessions
- **Progress Visualization**: Charts and statistics for fitness progress
- **Scheduling**: Plan and schedule workout sessions
- **Notifications**: Reminders for scheduled workouts
- **Social Features**: Connect with friends and share achievements

## Technology Stack

### Frontend

- **React Native/Expo**: Mobile app framework
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: Navigation and routing

### Backend

- **FastAPI**: High-performance Python web framework
- **SQLModel**: SQL database ORM
- **PostgreSQL**: Relational database
- **Alembic**: Database migrations
- **JWT**: Authentication tokens

### Infrastructure

- **Docker**: Containerization
- **Traefik**: Reverse proxy and SSL termination
- **Sentry**: Error tracking and monitoring

## Development Workflow

1. **Sprint Planning**: Define tasks and assign story points
2. **Feature Development**: Create feature branches and implement changes
3. **Code Review**: Submit pull requests for review
4. **Testing**: Run tests to ensure quality
5. **Deployment**: Deploy changes to production
6. **Monitoring**: Monitor application performance and errors

## Contributing

Please refer to [DEVELOPMENT.md](DEVELOPMENT.md) for detailed information on how to contribute to the project, including coding standards, workflow, and best practices.

## Deployment

Please refer to [DEPLOYMENT.md](DEPLOYMENT.md) for detailed information on how to deploy the application to production environments, including Docker setup, environment configuration, and monitoring.

## API Documentation

Please refer to [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed information about the API endpoints, request/response formats, and authentication requirements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or assistance, contact the project maintainers:

- Frontend: [frontend-lead@example.com](mailto:frontend-lead@example.com)
- Backend: [backend-lead@example.com](mailto:backend-lead@example.com)
- DevOps: [devops-lead@example.com](mailto:devops-lead@example.com)