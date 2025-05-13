# Kondition - Fitness Motivator App

## Project Overview

Kondition is a fitness motivator application designed to help users maintain consistent workout routines, track progress, and stay motivated on their fitness journey. The app focuses on creating a seamless user experience with features like authentication, workout scheduling, progress tracking, and social engagement.

## Tech Stack

### Frontend
- **React Native/Expo**: Mobile app framework for cross-platform development
- **Expo Router**: Navigation and routing
- **React Navigation**: Tab-based navigation
- **Styled Components**: UI theming and styling
- **Expo Vector Icons**: Icon library

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLModel**: SQL database ORM
- **PostgreSQL**: Relational database
- **Alembic**: Database migrations
- **JWT**: Authentication tokens
- **Docker**: Containerization

### Infrastructure
- **Firebase**: Authentication (alternative/future implementation)
- **Sentry**: Error tracking and monitoring

## Architecture

The project follows a modern client-server architecture:

### Frontend Architecture
- **Expo-based React Native app** with a tab-based navigation structure
- **Component-based design** with reusable UI elements
- **Theme support** for light and dark modes
- **Screen-based organization** with authentication flow

### Backend Architecture
- **RESTful API** built with FastAPI
- **Model-View-Controller (MVC)** pattern
- **JWT-based authentication** with token refresh
- **Database migrations** using Alembic
- **Containerized deployment** with Docker

## Frontend Components

### Navigation Structure
- **Root Layout**: Manages authentication state and main navigation
- **Tab Navigation**: Home and Explore tabs
- **Authentication Flow**: Login screen with email/password

### Screens
1. **Login Screen**: User authentication with email/password
   - Form validation
   - Remember me functionality
   - Password visibility toggle
   - Error handling

2. **Home Screen**: Main dashboard and entry point
   - App introduction
   - Call-to-action buttons
   - Navigation to login

3. **Explore Screen**: Feature showcase
   - List of app features with icons
   - Visual representation of app capabilities

### UI Components
- **ThemedText**: Text component with theme support
- **ThemedView**: View component with theme support
- **Button**: Customizable button with loading state
- **Input**: Form input with validation and error display
- **Checkbox**: Toggle component for boolean inputs
- **IconSymbol**: Icon wrapper for consistent styling
- **HapticTab**: Tab with haptic feedback

## Backend API

### Authentication Endpoints
- `POST /login/access-token`: Obtain JWT access token
- `POST /login/test-token`: Validate token
- `POST /password-recovery/{email}`: Initiate password recovery
- `POST /reset-password/`: Reset password with token

### User Management Endpoints
- `GET /users/`: List all users (admin only)
- `POST /users/`: Create new user (admin only)
- `GET /users/me`: Get current user profile
- `PATCH /users/me`: Update current user profile
- `PATCH /users/me/password`: Update current user password
- `DELETE /users/me`: Delete current user account
- `POST /users/signup`: Register new user
- `GET /users/{user_id}`: Get user by ID
- `PATCH /users/{user_id}`: Update user (admin only)
- `DELETE /users/{user_id}`: Delete user (admin only)

### Data Models
- **User**: User account information
- **Token**: Authentication token
- **Item**: Generic item model (for future feature implementation)

## Authentication Flow

1. **Registration**: Users can sign up with email and password
2. **Login**: Users authenticate with credentials to receive JWT token
3. **Token Usage**: JWT token is included in API requests for authorization
4. **Password Recovery**: Email-based password reset flow
5. **Profile Management**: Users can update profile information and change passwords

## Development Setup

### Prerequisites
- Node.js and npm/yarn
- Python 3.9+
- Docker and Docker Compose
- Expo CLI

### Frontend Setup
```bash
# Navigate to the Expo app directory
cd PROJECT/KonditionFastAPI/KonditionExpo

# Install dependencies
npm install

# Start the development server
npm start
```

### Backend Setup
```bash
# Navigate to the backend directory
cd PROJECT/KonditionFastAPI/backend

# Set up a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Run migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

### Docker Setup
```bash
# From the project root
cd PROJECT/KonditionFastAPI

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Project Roadmap

The project follows a phased implementation approach based on MoSCoW prioritization:

### Must Haves (Phase 1)
- User Registration & Login
- Set Workout Schedule
- Push Notifications
- Log Workouts

### Should Haves (Phase 2)
- Progress Dashboard
- Profile & Goals
- Edit & Manage Schedule
- Basic Workout Library

### Could Haves (Phase 3)
- Social Features / Leaderboard
- Motivational Tips & Quotes
- Goal Reminders & Achievement Badges
- Google/Apple Single Sign-On
- Social Media Sharing

### Won't Have (Future Consideration)
- AI-Powered Personalized Workouts
- Nutritional Tracking

## Sprint Planning

### Sprint 1: Foundation
- Authentication & User Accounts
- Basic UI/UX Implementation
- Project Structure Setup

### Sprint 2: Core Functionality
- Scheduling & Notifications
- Workout Logging
- Basic Progress Tracking

### Sprint 3: Enhanced Features
- Motivational Content
- Goals & Achievements
- Profile Customization

### Sprint 4: Social & Engagement
- Social Features (if included)
- Challenges/Leaderboards
- Final Polishing

## Contributing

### Development Workflow
1. Create feature branches from main
2. Implement changes with appropriate tests
3. Submit pull requests for review
4. Merge approved PRs to main

### Code Standards
- Follow TypeScript/Python best practices
- Write unit tests for new features
- Document API endpoints and components

## Deployment

### Production Deployment
The application can be deployed using Docker:

```bash
# Build and deploy
docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d
```

### Environment Configuration
- Configure environment variables for production settings
- Set up proper CORS settings for production domains
- Enable Sentry for error tracking in production

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)