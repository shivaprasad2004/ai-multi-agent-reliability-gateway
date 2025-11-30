# ⭐ AI Multi-Agent Reliability Gateway

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

A **production-grade AI Gateway** that provides a unified interface for LLM interactions with multi-agent pipelines, reliability features, caching, and comprehensive monitoring. Built for enterprise-scale AI applications.

## 🚀 Features

- **Multi-Agent Pipeline**: Generator → Safety → Quality agent workflow
- **Reliability Layer**: Retries, timeouts, fallback, and circuit breakers
- **Provider Adapters**: Support for OpenAI, Gemini, and Mock providers
- **Guardrails**: Input/output validation, PII detection, toxicity filtering
- **Caching**: MySQL-based exact-match caching with SHA-256 hashing
- **Metrics**: Comprehensive request tracking and analytics
- **Admin Dashboard**: Full React-based management interface
- **Authentication**: JWT-based auth with API key support

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "AI Multi-Agent Reliability Gateway"
```

2. Copy environment file:
```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your configuration:
```env
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ai_gateway
DB_USER=gateway_user
DB_PASSWORD=gateway_pass
JWT_SECRET=your-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

## 🚀 Running the Application - Action Plan

### ⚡ Quick Start (3 Steps)

**Step 1: Ensure Docker Desktop is Running**
- Open Docker Desktop
- Wait for it to fully start (green status)

**Step 2: Start the Application**
```bash
# Windows
START.bat

# Linux/Mac
./START.sh

# OR manually
docker-compose up --build
```

**Step 3: Access the Application**
- Open browser: http://localhost:3000
- Login: `admin@example.com` / `Admin123`

**That's it!** The application will:
- Build all Docker containers
- Start MySQL database
- Run migrations automatically
- Seed admin user
- Start backend (port 4000)
- Start frontend (port 3000)

**Wait time:** 30-60 seconds for first startup

### 📖 Detailed Instructions

For complete step-by-step guide, see:
- **[QUICK_START.md](QUICK_START.md)** - Detailed action plan with troubleshooting
- **[RUN_APPLICATION.txt](RUN_APPLICATION.txt)** - Quick reference card

This will:
- Start MySQL database with health checks
- Wait for database to be ready
- Run database migrations automatically
- Seed admin user and mock provider
- Start backend server (port 4000) with health checks
- Start frontend server (port 3000) with nginx

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

```bash
# Production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔑 Default Credentials

- **Email**: `admin@example.com`
- **Password**: `Admin123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### AI Gateway
- `POST /api/v1/ai/chat` - Main AI chat endpoint (requires API key)

### Admin Endpoints
- `GET /api/admin/providers` - List providers
- `POST /api/admin/providers` - Create provider
- `PUT /api/admin/providers/:id` - Update provider
- `DELETE /api/admin/providers/:id` - Delete provider

- `GET /api/admin/models` - List models
- `POST /api/admin/models` - Create model
- `PUT /api/admin/models/:id` - Update model
- `DELETE /api/admin/models/:id` - Delete model

- `GET /api/admin/agents` - List agents
- `POST /api/admin/agents` - Create agent
- `PUT /api/admin/agents/:id` - Update agent
- `POST /api/admin/agents/reorder` - Reorder agents
- `DELETE /api/admin/agents/:id` - Delete agent

- `GET /api/admin/metrics/summary` - Get metrics summary
- `GET /api/admin/metrics/cache` - Get cache statistics
- `GET /api/admin/metrics/latency` - Get latency statistics
- `GET /api/admin/metrics/requests` - List requests
- `GET /api/admin/metrics/guardrails` - List guardrail violations

- `GET /api/admin/api-keys` - List API keys
- `POST /api/admin/api-keys` - Create API key
- `PUT /api/admin/api-keys/:id` - Update API key
- `DELETE /api/admin/api-keys/:id` - Delete API key

## 📝 API Usage Examples

### Chat Endpoint

```bash
curl -X POST http://localhost:4000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "prompt": "What is artificial intelligence?",
    "taskType": "chat",
    "maxTokens": 1000,
    "temperature": 0.7
  }'
```

### Response Format

```json
{
  "success": true,
  "data": {
    "content": "AI response...",
    "inputTokens": 10,
    "outputTokens": 50,
    "latencyMs": 1200,
    "cacheHit": false
  }
}
```

## 🏗️ Architecture

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## 📚 API Documentation

See [docs/api.md](docs/api.md) for complete API documentation.

## 🧪 Testing

Use the Playground page in the admin dashboard to test the AI endpoint interactively.

## 📊 Monitoring

Access the dashboard at `http://localhost:3000` to view:
- Request metrics
- Cache statistics
- Latency trends
- Guardrail violations
- Agent pipeline configuration

## 🔧 Configuration

### Reliability Settings
- `MAX_RETRIES`: Maximum retry attempts (default: 3)
- `REQUEST_TIMEOUT_MS`: Request timeout in milliseconds (default: 30000)
- `CIRCUIT_BREAKER_THRESHOLD`: Failures before opening circuit (default: 5)
- `CIRCUIT_BREAKER_TIMEOUT_MS`: Circuit breaker timeout (default: 60000)

### Cache Settings
- `CACHE_ENABLED`: Enable/disable caching (default: true)
- `CACHE_TTL_HOURS`: Cache time-to-live in hours (default: 24)

## 🐳 Docker Services

- **mysql**: MySQL 8.0 database
- **backend**: Node.js Express backend
- **frontend**: React + Vite frontend (served via Nginx)

## 🐳 Docker Services

- **mysql**: MySQL 8.0 database with health checks
- **backend**: Node.js Express backend with auto-migrations
- **frontend**: React + Vite frontend served via Nginx

All services include health checks and proper startup dependencies.

## 🔒 Security

- JWT token-based authentication
- API key middleware for service-to-service auth
- Password hashing with bcrypt
- Input sanitization and validation
- PII detection and filtering
- Rate limiting via API key daily limits
- CORS configuration for frontend

## 📊 Production Features

- Health checks for all services
- Database connection retry logic
- Automatic migrations on startup
- Nginx reverse proxy for frontend
- Gzip compression
- Static asset caching
- Security headers
- Container health monitoring

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📚 Additional Documentation

- **[ACTION_PLAN.md](ACTION_PLAN.md)** - Step-by-step action plan to run the app
- **[QUICK_START.md](QUICK_START.md)** - Detailed quick start guide
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - Guide to upload to GitHub
- [Architecture Documentation](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Production Readiness](PRODUCTION_READY.md)
- [Changelog](CHANGELOG.md)

## 🌟 Features Overview

- ✅ **Multi-Agent Pipeline** - Generator → Safety → Quality workflow
- ✅ **Reliability Layer** - Retries, timeouts, fallback, circuit breakers
- ✅ **Provider Adapters** - OpenAI, Gemini, Mock (extensible)
- ✅ **Guardrails** - PII detection, toxicity filtering, validation
- ✅ **Caching** - SHA-256 exact-match caching with MySQL
- ✅ **Metrics** - Comprehensive observability and analytics
- ✅ **Admin Dashboard** - Full React-based management interface
- ✅ **Docker Ready** - Complete containerization with health checks
- ✅ **Production Ready** - Industry-grade reliability and monitoring

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-multi-agent-reliability-gateway.git
cd ai-multi-agent-reliability-gateway

# Start with Docker
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# Login: admin@example.com / Admin123
```

## 📞 Support

- 📖 [Documentation](docs/)
- 🐛 [Report Bug](https://github.com/YOUR_USERNAME/ai-multi-agent-reliability-gateway/issues)
- 💡 [Request Feature](https://github.com/YOUR_USERNAME/ai-multi-agent-reliability-gateway/issues)
- 📧 Contact: [Your Email]

## 🙏 Acknowledgments

Built with modern technologies and best practices for enterprise AI applications.

