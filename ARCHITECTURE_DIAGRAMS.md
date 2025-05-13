# Kondition Architecture Diagrams

This document provides visual representations of the Kondition fitness app architecture.

## System Architecture

```mermaid
graph TD
    subgraph "Frontend"
        MobileApp["Mobile App\n(React Native/Expo)"]
    end

    subgraph "Backend"
        API["FastAPI Backend"]
        DB[(PostgreSQL)]
        Cache[(Redis Cache)]
    end

    subgraph "External Services"
        Push["Push Notification\nService"]
        Storage["Cloud Storage\n(S3/Firebase)"]
        Auth["Auth Provider\n(OAuth)"]
    end

    MobileApp <--> API
    API <--> DB
    API <--> Cache
    API <--> Push
    API <--> Storage
    MobileApp <--> Auth
    API <--> Auth
```

## Frontend Architecture

```mermaid
graph TD
    subgraph "App Structure"
        Router["Expo Router"]
        Screens["Screens"]
        Components["UI Components"]
        Hooks["Custom Hooks"]
        Services["API Services"]
        State["State Management"]
    end

    Router --> Screens
    Screens --> Components
    Screens --> Hooks
    Screens --> Services
    Components --> Hooks
    Services --> State
    Hooks --> State
```

## Backend Architecture

```mermaid
graph TD
    subgraph "FastAPI Backend"
        Main["Main App"]
        Routes["API Routes"]
        Models["Data Models"]
        Auth["Authentication"]
        CRUD["CRUD Operations"]
        Utils["Utilities"]
    end

    Main --> Routes
    Routes --> CRUD
    Routes --> Auth
    CRUD --> Models
    CRUD --> Utils
    Auth --> Utils
```

## Database Schema

```mermaid
erDiagram
    USER {
        uuid id PK
        string email
        string hashed_password
        string full_name
        boolean is_active
        boolean is_superuser
    }
    
    ITEM {
        uuid id PK
        string title
        string description
        uuid owner_id FK
    }
    
    WORKOUT {
        uuid id PK
        string title
        datetime date
        int duration
        string notes
        uuid user_id FK
    }
    
    SCHEDULE {
        uuid id PK
        string title
        datetime time
        string days
        boolean is_active
        uuid user_id FK
    }
    
    PROGRESS {
        uuid id PK
        datetime date
        float weight
        float body_fat
        string notes
        uuid user_id FK
    }
    
    USER ||--o{ ITEM : owns
    USER ||--o{ WORKOUT : logs
    USER ||--o{ SCHEDULE : creates
    USER ||--o{ PROGRESS : tracks
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant MobileApp
    participant API
    participant Database
    
    User->>MobileApp: Enter credentials
    MobileApp->>API: POST /login/access-token
    API->>Database: Verify credentials
    Database-->>API: Credentials valid
    API-->>MobileApp: Return JWT token
    MobileApp->>MobileApp: Store token
    MobileApp-->>User: Show authenticated UI
    
    Note over MobileApp,API: Subsequent requests
    
    MobileApp->>API: Request with JWT header
    API->>API: Validate token
    API->>Database: Fetch data
    Database-->>API: Return data
    API-->>MobileApp: Return response
    MobileApp-->>User: Display data
```

## Workout Logging Flow

```mermaid
sequenceDiagram
    participant User
    participant MobileApp
    participant API
    participant Database
    
    User->>MobileApp: Create workout log
    MobileApp->>API: POST /workouts/
    API->>Database: Store workout data
    Database-->>API: Confirm storage
    API-->>MobileApp: Return success
    MobileApp-->>User: Show confirmation
    
    User->>MobileApp: View workout history
    MobileApp->>API: GET /workouts/
    API->>Database: Fetch workout data
    Database-->>API: Return workout data
    API-->>MobileApp: Return workout list
    MobileApp-->>User: Display workout history
```

## Deployment Architecture

```mermaid
graph TD
    subgraph "Client Devices"
        iOS["iOS App"]
        Android["Android App"]
    end
    
    subgraph "Cloud Infrastructure"
        LB["Load Balancer"]
        
        subgraph "Application Servers"
            API1["API Server 1"]
            API2["API Server 2"]
            API3["API Server 3"]
        end
        
        subgraph "Database"
            Primary[(Primary DB)]
            Replica[(Replica DB)]
        end
        
        subgraph "Services"
            Cache[(Redis Cache)]
            Storage["Object Storage"]
            Queue["Message Queue"]
        end
        
        subgraph "Monitoring"
            Logs["Log Aggregation"]
            Metrics["Metrics Collection"]
            Alerts["Alert System"]
        end
    end
    
    iOS --> LB
    Android --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    API1 --> Primary
    API2 --> Primary
    API3 --> Primary
    Primary --> Replica
    API1 --> Cache
    API2 --> Cache
    API3 --> Cache
    API1 --> Storage
    API2 --> Storage
    API3 --> Storage
    API1 --> Queue
    API2 --> Queue
    API3 --> Queue
    API1 --> Logs
    API2 --> Logs
    API3 --> Logs
    Primary --> Logs
    API1 --> Metrics
    API2 --> Metrics
    API3 --> Metrics
    Primary --> Metrics
    Metrics --> Alerts
```

## User Journey Map

```mermaid
journey
    title Kondition User Journey
    section Onboarding
      Download app: 5: User
      Create account: 3: User
      Complete profile: 4: User
    section First Use
      Set fitness goals: 5: User
      Schedule first workout: 4: User
      Receive notification: 3: User
    section Regular Usage
      Log workout: 5: User, System
      View progress: 4: User
      Adjust schedule: 3: User
      Receive motivation: 4: System
    section Social Engagement
      Connect with friends: 3: User
      Share achievements: 4: User
      Join challenges: 5: User, System
```

## Feature Implementation Timeline

```mermaid
gantt
    title Kondition Feature Implementation
    dateFormat  YYYY-MM-DD
    section Authentication
    User Registration & Login      :a1, 2025-05-01, 14d
    Password Recovery              :a2, after a1, 7d
    OAuth Integration              :a3, after a2, 10d
    
    section Core Features
    Workout Logging                :b1, 2025-05-15, 14d
    Progress Tracking              :b2, after b1, 14d
    Scheduling                     :b3, after b1, 14d
    
    section Notifications
    Push Notifications Setup       :c1, 2025-06-01, 10d
    Workout Reminders              :c2, after c1, 7d
    Achievement Alerts             :c3, after c2, 7d
    
    section Social Features
    User Profiles                  :d1, 2025-06-15, 10d
    Friend Connections             :d2, after d1, 10d
    Activity Feed                  :d3, after d2, 14d
    Challenges & Leaderboards      :d4, after d3, 14d