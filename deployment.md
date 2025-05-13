# Kondition Deployment Guide

This document provides instructions for deploying the Kondition fitness motivator application to production environments. It covers Docker setup, environment configuration, and monitoring.

## Prerequisites

- Docker and Docker Compose
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- Server with at least 2GB RAM and 1 CPU core
- PostgreSQL database (can be containerized or external)

## Deployment Options

### Option 1: Docker Compose Deployment

This is the recommended approach for most deployments.

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd PROJECT/KonditionFastAPI
```

#### 2. Configure Environment Variables

Create a `.env` file in the project root:

```
# Backend
POSTGRES_SERVER=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<secure-password>
POSTGRES_DB=kondition
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=<secure-password>
SECRET_KEY=<generate-secret-key>
BACKEND_CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
SENTRY_DSN=<your-sentry-dsn>
ENVIRONMENT=production
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=<smtp-server>
SMTP_USER=<smtp-user>
SMTP_PASSWORD=<smtp-password>
EMAILS_FROM_EMAIL=info@yourdomain.com

# Frontend
API_URL=https://api.yourdomain.com
```

#### 3. Configure Docker Compose

Review and update the `docker-compose.yml` and `docker-compose.traefik.yml` files as needed.

#### 4. Deploy with Docker Compose

```bash
# Build and start the containers
docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Create initial data
docker-compose exec backend python -m app.initial_data
```

#### 5. Verify Deployment

- Backend API: https://api.yourdomain.com/docs
- Frontend: https://yourdomain.com

### Option 2: Kubernetes Deployment

For larger-scale deployments, Kubernetes provides better scalability and management.

#### 1. Prepare Kubernetes Configuration

Create Kubernetes manifests in a `k8s` directory:

- `namespace.yaml`: Define a namespace for the application
- `secrets.yaml`: Store sensitive information
- `configmap.yaml`: Store configuration
- `deployment-backend.yaml`: Backend deployment
- `deployment-frontend.yaml`: Frontend deployment
- `service-backend.yaml`: Backend service
- `service-frontend.yaml`: Frontend service
- `ingress.yaml`: Ingress configuration

#### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply secrets and configmap
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy backend
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml

# Deploy frontend
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

# Configure ingress
kubectl apply -f k8s/ingress.yaml
```

#### 3. Run Migrations

```bash
# Get a pod name
BACKEND_POD=$(kubectl get pods -n kondition -l app=backend -o jsonpath="{.items[0].metadata.name}")

# Run migrations
kubectl exec -it $BACKEND_POD -n kondition -- alembic upgrade head

# Create initial data
kubectl exec -it $BACKEND_POD -n kondition -- python -m app.initial_data
```

## Mobile App Deployment

### Building the Mobile App

#### 1. Configure Environment

Update the environment configuration in the Expo app:

```javascript
// app.config.js
export default {
  expo: {
    // ... other config
    extra: {
      apiUrl: process.env.API_URL || "https://api.yourdomain.com",
    },
  },
};
```

#### 2. Build for Android

```bash
cd KonditionExpo

# Build APK
eas build -p android --profile preview

# Build for Play Store
eas build -p android --profile production
```

#### 3. Build for iOS

```bash
cd KonditionExpo

# Build for TestFlight
eas build -p ios --profile preview

# Build for App Store
eas build -p ios --profile production
```

#### 4. Submit to App Stores

Follow the guidelines for submitting apps to:
- [Google Play Store](https://developer.android.com/distribute/console)
- [Apple App Store](https://developer.apple.com/app-store/submissions/)

## SSL Configuration

### Using Let's Encrypt with Traefik

Traefik can automatically obtain and renew SSL certificates from Let's Encrypt.

In `docker-compose.traefik.yml`:

```yaml
services:
  traefik:
    image: traefik:v2.5
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml
      - ./traefik/acme.json:/acme.json
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/acme.json"
      - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
```

Create an empty `acme.json` file and set proper permissions:

```bash
touch traefik/acme.json
chmod 600 traefik/acme.json
```

## Database Management

### Backup and Restore

#### Backup PostgreSQL Database

```bash
# Using Docker Compose
docker-compose exec db pg_dump -U postgres kondition > backup_$(date +%Y-%m-%d).sql

# Using external PostgreSQL
pg_dump -h <host> -U <user> -d kondition > backup_$(date +%Y-%m-%d).sql
```

#### Restore PostgreSQL Database

```bash
# Using Docker Compose
cat backup.sql | docker-compose exec -T db psql -U postgres -d kondition

# Using external PostgreSQL
psql -h <host> -U <user> -d kondition < backup.sql
```

### Database Migrations

```bash
# Using Docker Compose
docker-compose exec backend alembic upgrade head

# Using Kubernetes
kubectl exec -it $BACKEND_POD -n kondition -- alembic upgrade head
```

## Monitoring and Logging

### Prometheus and Grafana Setup

Add Prometheus and Grafana to your Docker Compose setup:

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:
```

### ELK Stack for Logging

Add ELK (Elasticsearch, Logstash, Kibana) to your Docker Compose setup:

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.14.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

### Sentry Integration

1. Create a Sentry account and project at [sentry.io](https://sentry.io)
2. Get your DSN and add it to your environment variables:

```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

3. Sentry is already integrated in the FastAPI backend:

```python
if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)
```

## CI/CD Pipeline

### GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.5.3
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
          
      - name: Deploy to production
        run: |
          ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "cd ${{ secrets.PROJECT_PATH }} && git pull && docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d --build && docker-compose exec -T backend alembic upgrade head"
```

### GitLab CI/CD

Create a `.gitlab-ci.yml` file:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: python:3.9
  script:
    - cd backend
    - pip install -e .
    - pytest

build:
  stage: build
  image: docker:20.10.12
  services:
    - docker:20.10.12-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker-compose build
    - docker-compose push

deploy:
  stage: deploy
  image: alpine:3.14
  script:
    - apk add --no-cache openssh-client
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $SSH_HOST >> ~/.ssh/known_hosts
    - ssh $SSH_USER@$SSH_HOST "cd $PROJECT_PATH && git pull && docker-compose -f docker-compose.yml -f docker-compose.traefik.yml up -d --build && docker-compose exec -T backend alembic upgrade head"
  only:
    - main
```

## Scaling

### Horizontal Scaling

For Docker Compose, you can scale services:

```bash
docker-compose up -d --scale backend=3
```

For Kubernetes, you can scale deployments:

```bash
kubectl scale deployment backend -n kondition --replicas=3
```

### Vertical Scaling

Increase resources in your Docker Compose file:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

For Kubernetes, update resource requests and limits:

```yaml
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1"
```

## Performance Optimization

### Backend Optimization

1. **Database Indexing**

   Ensure proper indexes are created for frequently queried fields:

   ```python
   # In SQLModel models
   class User(SQLModel, table=True):
       id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
       email: str = Field(unique=True, index=True)  # Indexed field
   ```

2. **Caching**

   Implement Redis caching:

   ```yaml
   # Add to docker-compose.yml
   services:
     redis:
       image: redis:6.2
       ports:
         - "6379:6379"
   ```

3. **Async Operations**

   FastAPI already uses async/await for better performance.

### Frontend Optimization

1. **Code Splitting**

   Implement code splitting in the React Native app:

   ```javascript
   import { lazy, Suspense } from 'react';
   
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   
   function App() {
     return (
       <Suspense fallback={<LoadingIndicator />}>
         <HeavyComponent />
       </Suspense>
     );
   }
   ```

2. **Asset Optimization**

   Optimize images and assets:

   ```bash
   # Install sharp-cli
   npm install -g sharp-cli
   
   # Optimize images
   sharp -i assets/images/* -o assets/optimized/
   ```

## Security Considerations

### HTTPS

Ensure all traffic is encrypted with HTTPS:

- Configure Traefik or Nginx with SSL certificates
- Set up automatic redirects from HTTP to HTTPS
- Use HSTS headers

### Environment Variables

- Never commit sensitive environment variables to version control
- Use a secure method to manage secrets (e.g., Docker secrets, Kubernetes secrets)
- Rotate secrets regularly

### Database Security

- Use strong passwords
- Limit database access to necessary services
- Enable SSL for database connections
- Regularly backup the database

### API Security

- Implement rate limiting
- Use proper authentication and authorization
- Validate all input data
- Keep dependencies updated

## Troubleshooting

### Common Issues

#### Docker Compose Issues

**Issue**: Services not starting properly

**Solution**:
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild services
docker-compose up -d --build
```

#### Database Connection Issues

**Issue**: Backend can't connect to the database

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs db

# Verify connection settings in .env file
```

#### SSL Certificate Issues

**Issue**: SSL certificates not being issued or renewed

**Solution**:
```bash
# Check Traefik logs
docker-compose logs traefik

# Verify DNS settings
dig yourdomain.com

# Check acme.json permissions
chmod 600 traefik/acme.json
```

## Maintenance

### Regular Updates

1. **Update Dependencies**

   ```bash
   # Backend
   pip install -U -e .
   
   # Frontend
   npm update
   ```

2. **Update Docker Images**

   ```bash
   docker-compose pull
   docker-compose up -d
   ```

3. **Database Maintenance**

   ```bash
   # Vacuum the database
   docker-compose exec db psql -U postgres -d kondition -c "VACUUM ANALYZE;"
   ```

### Backup Strategy

1. **Database Backups**

   Set up a cron job for regular backups:

   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

   Create a backup script:

   ```bash
   #!/bin/bash
   # backup-script.sh
   
   BACKUP_DIR="/path/to/backups"
   TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
   
   # Create backup
   docker-compose exec -T db pg_dump -U postgres kondition > "$BACKUP_DIR/kondition_$TIMESTAMP.sql"
   
   # Compress backup
   gzip "$BACKUP_DIR/kondition_$TIMESTAMP.sql"
   
   # Remove backups older than 30 days
   find "$BACKUP_DIR" -name "kondition_*.sql.gz" -mtime +30 -delete
   ```

2. **File Backups**

   Back up configuration files and user uploads:

   ```bash
   # Add to crontab
   0 3 * * * tar -czf /path/to/backups/config_$(date +\%Y-\%m-\%d).tar.gz /path/to/config
   ```

## Disaster Recovery

### Recovery Plan

1. **Server Failure**

   - Provision a new server
   - Install Docker and Docker Compose
   - Clone the repository
   - Restore configuration files
   - Restore the database from backup
   - Start the services

2. **Database Corruption**

   - Stop the services
   - Restore the database from the latest backup
   - Start the services
   - Verify data integrity

3. **Data Loss**

   - Identify the extent of data loss
   - Restore from the most recent backup
   - Implement additional safeguards to prevent future data loss

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Expo Deployment Guide](https://docs.expo.dev/distribution/introduction/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
