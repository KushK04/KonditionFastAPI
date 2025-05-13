# Kondition API Documentation

This document provides detailed information about the Kondition API endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:8000/api/v1  # Local development
https://api.kondition.example.com/api/v1  # Production example
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Token).

### Authentication Header

```
Authorization: Bearer {access_token}
```

### Obtaining a Token

```
POST /login/access-token
```

**Request Body:**
```json
{
  "username": "user@example.com",  // Email address
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Testing a Token

```
POST /login/test-token
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "John Doe"
}
```

## API Endpoints

### Authentication

#### Login

```
POST /login/access-token
```

Authenticates a user and returns a JWT access token.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200 OK`: Successful authentication
- `400 Bad Request`: Incorrect email or password
- `400 Bad Request`: Inactive user

#### Password Recovery

```
POST /password-recovery/{email}
```

Initiates the password recovery process for a user.

**Path Parameters:**
- `email`: User's email address

**Response:**
```json
{
  "message": "Password recovery email sent"
}
```

**Status Codes:**
- `200 OK`: Recovery email sent
- `404 Not Found`: User not found

#### Reset Password

```
POST /reset-password/
```

Resets a user's password using a token.

**Request Body:**
```json
{
  "token": "recovery-token",
  "new_password": "new-password123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

**Status Codes:**
- `200 OK`: Password updated
- `400 Bad Request`: Invalid token
- `404 Not Found`: User not found

### User Management

#### Get Current User

```
GET /users/me
```

Returns the current user's information.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "John Doe"
}
```

**Status Codes:**
- `200 OK`: User information returned
- `401 Unauthorized`: Invalid or missing token

#### Update Current User

```
PATCH /users/me
```

Updates the current user's information.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "email": "updated-email@example.com"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "updated-email@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "Updated Name"
}
```

**Status Codes:**
- `200 OK`: User updated
- `401 Unauthorized`: Invalid or missing token
- `409 Conflict`: Email already exists

#### Update Password

```
PATCH /users/me/password
```

Updates the current user's password.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "current_password": "current-password",
  "new_password": "new-password123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

**Status Codes:**
- `200 OK`: Password updated
- `400 Bad Request`: Incorrect current password
- `400 Bad Request`: New password same as current
- `401 Unauthorized`: Invalid or missing token

#### Delete Current User

```
DELETE /users/me
```

Deletes the current user's account.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Status Codes:**
- `200 OK`: User deleted
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Super users cannot delete themselves

#### User Registration

```
POST /users/signup
```

Registers a new user without admin privileges.

**Request Body:**
```json
{
  "email": "new-user@example.com",
  "password": "password123",
  "full_name": "New User"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "new-user@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "New User"
}
```

**Status Codes:**
- `200 OK`: User created
- `400 Bad Request`: Email already exists

### Admin Endpoints

#### Get All Users

```
GET /users/
```

Returns a list of all users (admin only).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user1@example.com",
      "is_active": true,
      "is_superuser": false,
      "full_name": "User One"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174000",
      "email": "user2@example.com",
      "is_active": true,
      "is_superuser": false,
      "full_name": "User Two"
    }
  ],
  "count": 2
}
```

**Status Codes:**
- `200 OK`: Users returned
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not a superuser

#### Create User

```
POST /users/
```

Creates a new user (admin only).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "email": "new-user@example.com",
  "password": "password123",
  "full_name": "New User",
  "is_superuser": false,
  "is_active": true
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "new-user@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "New User"
}
```

**Status Codes:**
- `200 OK`: User created
- `400 Bad Request`: Email already exists
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not a superuser

#### Get User by ID

```
GET /users/{user_id}
```

Returns a specific user by ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `user_id`: UUID of the user

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "John Doe"
}
```

**Status Codes:**
- `200 OK`: User returned
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not authorized to view this user
- `404 Not Found`: User not found

#### Update User

```
PATCH /users/{user_id}
```

Updates a specific user (admin only).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `user_id`: UUID of the user

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "email": "updated-email@example.com",
  "is_active": true,
  "is_superuser": false
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "updated-email@example.com",
  "is_active": true,
  "is_superuser": false,
  "full_name": "Updated Name"
}
```

**Status Codes:**
- `200 OK`: User updated
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not a superuser
- `404 Not Found`: User not found
- `409 Conflict`: Email already exists

#### Delete User

```
DELETE /users/{user_id}
```

Deletes a specific user (admin only).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `user_id`: UUID of the user

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Status Codes:**
- `200 OK`: User deleted
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not a superuser or trying to delete self
- `404 Not Found`: User not found

### Items

#### Get Items

```
GET /items/
```

Returns a list of items owned by the current user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Item 1",
      "description": "Description for item 1",
      "owner_id": "123e4567-e89b-12d3-a456-426614174000"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174000",
      "title": "Item 2",
      "description": "Description for item 2",
      "owner_id": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "count": 2
}
```

**Status Codes:**
- `200 OK`: Items returned
- `401 Unauthorized`: Invalid or missing token

#### Create Item

```
POST /items/
```

Creates a new item owned by the current user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "title": "New Item",
  "description": "Description for new item"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "New Item",
  "description": "Description for new item",
  "owner_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Status Codes:**
- `200 OK`: Item created
- `401 Unauthorized`: Invalid or missing token

#### Get Item by ID

```
GET /items/{item_id}
```

Returns a specific item by ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `item_id`: UUID of the item

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Item",
  "description": "Description for item",
  "owner_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Status Codes:**
- `200 OK`: Item returned
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not authorized to view this item
- `404 Not Found`: Item not found

#### Update Item

```
PATCH /items/{item_id}
```

Updates a specific item.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `item_id`: UUID of the item

**Request Body:**
```json
{
  "title": "Updated Item",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated Item",
  "description": "Updated description",
  "owner_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Status Codes:**
- `200 OK`: Item updated
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not authorized to update this item
- `404 Not Found`: Item not found

#### Delete Item

```
DELETE /items/{item_id}
```

Deletes a specific item.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `item_id`: UUID of the item

**Response:**
```json
{
  "message": "Item deleted successfully"
}
```

**Status Codes:**
- `200 OK`: Item deleted
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not authorized to delete this item
- `404 Not Found`: Item not found

## Error Responses

### Standard Error Format

```json
{
  "detail": "Error message"
}
```

### Validation Error Format

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are as follows:

- Authentication endpoints: 5 requests per minute
- Other endpoints: 60 requests per minute

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code.

## Pagination

Endpoints that return lists of items support pagination using `skip` and `limit` query parameters:

- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100, max: 1000)

Example:
```
GET /users/?skip=20&limit=10
```

This would return users 21-30 (if available).

## Future API Endpoints

The following endpoints are planned for future implementation:

### Workouts

```
GET /workouts/
POST /workouts/
GET /workouts/{workout_id}
PATCH /workouts/{workout_id}
DELETE /workouts/{workout_id}
```

### Schedules

```
GET /schedules/
POST /schedules/
GET /schedules/{schedule_id}
PATCH /schedules/{schedule_id}
DELETE /schedules/{schedule_id}
```

### Progress

```
GET /progress/
POST /progress/
GET /progress/{progress_id}
PATCH /progress/{progress_id}
DELETE /progress/{progress_id}
```

### Social

```
GET /friends/
POST /friends/{user_id}
DELETE /friends/{user_id}
GET /feed/
POST /feed/
```

## Webhooks

The API will support webhooks for real-time notifications of events:

```
POST /webhooks/register
```

**Request Body:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["workout.created", "workout.completed", "goal.achieved"]
}
```

## API Versioning

The API uses URL versioning (`/api/v1/`). When breaking changes are introduced, a new version will be created (`/api/v2/`).

## Cross-Origin Resource Sharing (CORS)

The API supports CORS for specified origins. By default, the following origins are allowed:

- `http://localhost:3000`
- `http://localhost:8080`
- `https://kondition.example.com`

## API Status

```
GET /utils/ping
```

Returns the API status.

**Response:**
```json
{
  "ping": "pong"
}
```

## API Documentation

Interactive API documentation is available at:

- Swagger UI: `/docs`
- ReDoc: `/redoc`