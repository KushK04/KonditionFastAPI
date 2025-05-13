# Kondition Development Guide

This document provides guidelines and instructions for developers working on the Kondition fitness motivator application. It covers development setup, coding standards, workflow, and best practices.

## Getting Started

### Prerequisites

- **Node.js** (v16+) and npm/yarn
- **Python** (v3.9+)
- **PostgreSQL** (v13+)
- **Docker** and Docker Compose
- **Git**
- **Expo CLI** (`npm install -g expo-cli`)

### Repository Setup

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

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

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

### Docker Setup (Alternative)

```bash
# From the project root
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Create initial data
docker-compose exec backend python -m app.initial_data
```

## Development Workflow

### Git Workflow

We follow a feature branch workflow:

1. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and commit**

```bash
git add .
git commit -m "Descriptive commit message"
```

3. **Push changes and create a pull request**

```bash
git push origin feature/your-feature-name
```

4. **After review and approval, merge to main**

### Sprint Cycle

- **Sprint Planning**: Define tasks and assign story points
- **Daily Standup**: Brief updates on progress and blockers
- **Sprint Review**: Demo completed features
- **Sprint Retrospective**: Discuss what went well and what could be improved

### Task Management

- Use the project board for task tracking
- Move tasks through the workflow: To Do → In Progress → Review → Done
- Link commits and PRs to relevant tasks

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the principle of "Do One Thing" (DOT)
- Keep functions and methods small and focused
- Use meaningful variable and function names
- Add comments for complex logic, but prefer self-documenting code
- Write tests for new features and bug fixes

### Frontend (React Native/Expo)

#### Style Guide

- Follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- Use TypeScript for type safety
- Use functional components with hooks
- Organize imports alphabetically
- Use consistent naming conventions:
  - Components: PascalCase (e.g., `LoginScreen.tsx`)
  - Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
  - Utilities: camelCase (e.g., `formatDate.ts`)

#### Component Structure

```typescript
// Import statements
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Type definitions
interface Props {
  title: string;
  onPress: () => void;
}

// Component definition
export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  // State and hooks
  const [isActive, setIsActive] = useState(false);
  
  // Event handlers
  const handlePress = () => {
    setIsActive(!isActive);
    onPress();
  };
  
  // Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    // styles here
  },
});
```

#### State Management

- Use React's built-in state management (useState, useReducer) for component-level state
- Use context API for shared state across components
- Consider Redux or MobX for complex state management needs

### Backend (FastAPI)

#### Style Guide

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) guidelines
- Use type hints for better IDE support and documentation
- Use docstrings to document functions, classes, and modules
- Format code with Black and isort
- Use meaningful variable and function names
- Keep functions and methods small and focused

#### API Structure

- Organize endpoints by resource
- Use appropriate HTTP methods:
  - GET: Retrieve resources
  - POST: Create resources
  - PUT/PATCH: Update resources
  - DELETE: Remove resources
- Return appropriate status codes
- Use Pydantic models for request/response validation
- Implement proper error handling

#### Example Endpoint

```python
@router.post("/items/", response_model=Item)
def create_item(
    *,
    session: SessionDep,
    item_in: ItemCreate,
    current_user: CurrentUser,
) -> Any:
    """
    Create a new item.
    """
    item = Item(
        title=item_in.title,
        description=item_in.description,
        owner_id=current_user.id,
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
```

## Testing

### Frontend Testing

- Use Jest for unit and component testing
- Use React Native Testing Library for component testing
- Write tests for components, hooks, and utilities
- Run tests with `npm test`

### Backend Testing

- Use pytest for unit and integration testing
- Write tests for API endpoints, CRUD operations, and utilities
- Run tests with `pytest`
- Check coverage with `pytest --cov=app`

### End-to-End Testing

- Use Detox or Appium for mobile app E2E testing
- Test critical user flows:
  - Authentication
  - Workout logging
  - Progress tracking
  - Social features

## Debugging

### Frontend Debugging

- Use React Native Debugger
- Use console.log for simple debugging
- Use breakpoints in VS Code
- Check the Metro bundler console for errors

### Backend Debugging

- Use pdb or VS Code debugger
- Check FastAPI logs
- Use Swagger UI for API testing
- Monitor database queries with logging

## Deployment

### Frontend Deployment

- Build the app with Expo:
  ```bash
  expo build:android
  expo build:ios
  ```
- Submit to app stores:
  - Google Play Store
  - Apple App Store

### Backend Deployment

- Build and deploy with Docker:
  ```bash
  docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d
  ```
- Set up CI/CD pipeline for automated deployment
- Configure environment variables for production

## Performance Considerations

### Frontend Performance

- Optimize list rendering with FlatList
- Use memo and useMemo to prevent unnecessary re-renders
- Optimize images and assets
- Implement lazy loading for heavy components
- Use performance monitoring tools

### Backend Performance

- Use database indexes for frequently queried fields
- Implement caching for expensive operations
- Use async operations for I/O-bound tasks
- Monitor and optimize database queries
- Implement pagination for large data sets

## Security Best Practices

### Frontend Security

- Validate user input
- Securely store sensitive data (tokens, user info)
- Implement proper authentication flows
- Use HTTPS for all API requests
- Keep dependencies updated

### Backend Security

- Implement proper authentication and authorization
- Use secure password hashing
- Validate and sanitize input data
- Implement rate limiting
- Use HTTPS
- Keep dependencies updated
- Follow the principle of least privilege

## Accessibility

- Ensure proper contrast ratios
- Provide text alternatives for images
- Support screen readers
- Implement keyboard navigation
- Test with accessibility tools

## Internationalization

- Use a translation framework (i18n)
- Extract all user-facing strings
- Support right-to-left languages
- Consider cultural differences in design

## Resources

### Documentation

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)

### Learning Resources

- [React Native in Action](https://www.manning.com/books/react-native-in-action)
- [FastAPI for Data Scientists](https://fastapi.tiangolo.com/tutorial/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Python Best Practices](https://docs.python-guide.org/)

### Tools

- [VS Code](https://code.visualstudio.com/) with extensions:
  - ESLint
  - Prettier
  - Python
  - React Native Tools
- [Postman](https://www.postman.com/) for API testing
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [pgAdmin](https://www.pgadmin.org/) for PostgreSQL management

## Troubleshooting

### Common Issues

#### Frontend

- **Metro bundler issues**: Clear cache with `expo start -c`
- **Dependency conflicts**: Check package versions and resolve conflicts
- **Expo build errors**: Verify Expo SDK compatibility
- **Styling inconsistencies**: Use theme-aware components consistently

#### Backend

- **Database connection issues**: Check connection string and credentials
- **Migration errors**: Ensure migrations are applied in the correct order
- **API errors**: Check request/response formats and validation
- **Authentication issues**: Verify token generation and validation

## Contact

For questions or assistance, contact the project maintainers:

- Frontend: [frontend-lead@example.com](mailto:frontend-lead@example.com)
- Backend: [backend-lead@example.com](mailto:backend-lead@example.com)
- DevOps: [devops-lead@example.com](mailto:devops-lead@example.com)