# Deployment Guide

## Quick Start (Development)

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- MySQL: localhost:3306

## Production Deployment

### 1. Environment Configuration

Create a `.env` file in the project root:

```env
# Database
MYSQL_ROOT_PASSWORD=your-secure-root-password
MYSQL_PASSWORD=your-secure-db-password

# JWT
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-chars

# API Keys (optional)
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# Frontend
FRONTEND_API_URL=http://your-domain.com:4000
```

### 2. Build and Run

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### 3. Verify Deployment

```bash
# Check all services are healthy
docker-compose ps

# Test backend health
curl http://localhost:4000/health

# Test frontend
curl http://localhost:3000/health
```

### 4. Database Backup

```bash
# Backup database
docker exec ai-gateway-mysql mysqldump -u gateway_user -p ai_gateway > backup.sql

# Restore database
docker exec -i ai-gateway-mysql mysql -u gateway_user -p ai_gateway < backup.sql
```

## Docker Network Architecture

```
┌─────────────────────────────────────────┐
│         Docker Network (bridge)         │
│                                         │
│  ┌──────────┐    ┌──────────┐         │
│  │ Frontend │───▶│ Backend  │         │
│  │ :3000    │    │ :4000    │         │
│  └──────────┘    └────┬─────┘         │
│                       │                │
│                  ┌────▼─────┐         │
│                  │  MySQL   │         │
│                  │  :3306    │         │
│                  └──────────┘         │
└─────────────────────────────────────────┘
```

## Scaling

### Horizontal Scaling (Backend)

```yaml
# Add to docker-compose.yml
backend:
  deploy:
    replicas: 3
```

Note: Requires Docker Swarm or Kubernetes for true horizontal scaling.

### Database Optimization

For production, consider:
- MySQL connection pooling (already configured)
- Read replicas for analytics
- Database indexing on frequently queried columns

## Monitoring

### Health Checks

All services include health checks:
- Backend: `GET /health`
- Frontend: `GET /health` (nginx)
- MySQL: `mysqladmin ping`

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Metrics

Access the admin dashboard at http://localhost:3000 for:
- Request metrics
- Cache statistics
- Latency analytics
- Error rates

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS (use reverse proxy like Traefik/Nginx)
- [ ] Restrict database port exposure
- [ ] Use secrets management (Docker secrets, Vault)
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Monitor guardrail violations

## Troubleshooting

### Backend won't start

```bash
# Check database connection
docker exec ai-gateway-backend node -e "require('./src/config/db').authenticate().then(() => console.log('OK')).catch(console.error)"

# Check logs
docker-compose logs backend
```

### Frontend can't connect to backend

```bash
# Verify nginx proxy config
docker exec ai-gateway-frontend cat /etc/nginx/conf.d/default.conf

# Test backend from frontend container
docker exec ai-gateway-frontend wget -O- http://backend:4000/health
```

### Database connection issues

```bash
# Test MySQL from backend container
docker exec ai-gateway-backend ping mysql

# Check MySQL logs
docker-compose logs mysql
```

## Production Best Practices

1. **Use Environment Variables**: Never hardcode secrets
2. **Enable HTTPS**: Use reverse proxy (Traefik, Nginx, Caddy)
3. **Regular Backups**: Automate database backups
4. **Monitoring**: Set up Prometheus/Grafana or similar
5. **Log Aggregation**: Use ELK stack or similar
6. **Resource Limits**: Set CPU/memory limits in docker-compose
7. **Update Strategy**: Use rolling updates for zero downtime

## Resource Requirements

Minimum:
- CPU: 2 cores
- RAM: 4GB
- Disk: 20GB

Recommended:
- CPU: 4+ cores
- RAM: 8GB+
- Disk: 50GB+ (with logs and backups)

