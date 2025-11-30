# Architecture Documentation

## System Overview

The AI Multi-Agent Reliability Gateway is a full-stack application that provides a unified interface for LLM interactions with advanced reliability, caching, and monitoring features.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Applications                    │
└───────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │
┌───────────────────────▼───────────────────────────────────────┐
│                    Frontend (React + Vite)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Requests │  │Providers │  │ Playground│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬───────────────────────────────────────┘
                       │
                       │ REST API
                       │
┌───────────────────────▼───────────────────────────────────────┐
│              Backend (Node.js + Express)                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API Gateway Layer                       │    │
│  │  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │ Auth Routes  │  │ Gateway      │                │    │
│  │  │ Admin Routes│  │ Routes       │                │    │
│  │  └──────────────┘  └──────────────┘                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Multi-Agent Pipeline Orchestrator            │    │
│  │                                                       │    │
│  │  Input → Generator → Safety → Quality → Output      │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Reliability Layer                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ Retries  │  │ Timeouts │  │ Circuit  │         │    │
│  │  │          │  │          │  │ Breaker  │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Provider Adapter System                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ OpenAI   │  │ Gemini   │  │  Mock    │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Guardrails Module                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ Input    │  │ PII      │  │ Toxicity │         │    │
│  │  │ Validation│  │ Detection│  │ Filter   │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Caching Module                          │    │
│  │  SHA-256 Hash → MySQL Cache Lookup                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Metrics Module                           │    │
│  │  Request Logging → Analytics → Dashboard            │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────┬───────────────────────────────────────┘
                       │
                       │ Sequelize ORM
                       │
┌───────────────────────▼───────────────────────────────────────┐
│                    MySQL Database                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Users   │  │ Providers│  │  Models  │  │  Agents  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Requests │  │  Cache   │  │Guardrails│  │ API Keys │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└───────────────────────────────────────────────────────────────┘
```

## Module Descriptions

### 1. Authentication Module
- JWT-based authentication
- User registration and login
- API key generation and management
- Role-based access control (USER, ADMIN)

### 2. Gateway Module
- Main `/api/v1/ai/chat` endpoint
- Request routing and validation
- Response formatting
- Error handling

### 3. Multi-Agent Pipeline
- **Generator Agent**: Produces initial AI response
- **Safety Agent**: Checks for PII and toxicity
- **Quality Agent**: Polishes and rewrites output
- Configurable order and task-specific pipelines

### 4. Provider Adapter System
- Extensible adapter interface
- OpenAI adapter (GPT models)
- Gemini adapter (Gemini models)
- Mock adapter (for testing without API keys)
- Easy to add new providers

### 5. Reliability Layer
- **Retries**: Exponential backoff retry mechanism
- **Timeouts**: Configurable request timeouts
- **Fallback**: Primary → Backup model fallback
- **Circuit Breaker**: Prevents cascading failures

### 6. Guardrails Module
- **Input Validation**: Length, pattern checks
- **PII Detection**: Pattern-based PII detection
- **Toxicity Filter**: Keyword-based toxicity check
- **JSON Validation**: Schema validation for structured outputs

### 7. Caching Module
- SHA-256 hash-based exact match caching
- MySQL storage for cache entries
- Cache hit/miss tracking
- Configurable TTL

### 8. Metrics Module
- Request logging (latency, tokens, status)
- Cache statistics
- Latency analytics
- Guardrail violation tracking
- Dashboard visualization

### 9. Admin Module
- Provider management (CRUD)
- Model management (CRUD)
- Agent pipeline configuration
- Metrics and analytics
- API key management

## Data Flow

### Request Flow

1. **Client Request** → Frontend/API
2. **Authentication** → JWT or API Key validation
3. **Cache Check** → SHA-256 hash lookup
4. **If Cache Hit** → Return cached response
5. **If Cache Miss**:
   - Input validation (Guardrails)
   - Get agents for pipeline
   - For each agent:
     - Call LLM via adapter
     - Apply reliability layer (retry, timeout, circuit breaker)
     - Output validation (Guardrails)
   - Store in cache
   - Log metrics
   - Return response

### Pipeline Execution

```
Input Prompt
    ↓
[Generator Agent]
    ↓
Generated Content
    ↓
[Safety Agent]
    ↓
Safety-Checked Content
    ↓
[Quality Agent]
    ↓
Final Polished Output
    ↓
Cache & Metrics
    ↓
Response to Client
```

## Database Schema

### Core Tables
- `users`: User accounts
- `api_keys`: API key management
- `providers`: LLM provider configuration
- `models`: Model configuration per provider
- `agents`: Agent pipeline configuration
- `routing_rules`: Model routing rules
- `cache_entries`: Cache storage
- `requests`: Request metrics
- `guardrail_violations`: Guardrail violation logs

## Security

- JWT token-based authentication
- API key middleware for service-to-service auth
- Password hashing with bcrypt
- Input sanitization
- PII detection and filtering
- Rate limiting via API key daily limits

## Scalability Considerations

- Stateless backend design
- Database connection pooling
- Cache layer for performance
- Circuit breakers for resilience
- Horizontal scaling ready (Docker-based)

## Technology Stack

### Backend
- Node.js 20
- Express.js
- Sequelize ORM
- MySQL 8.0
- JWT authentication
- bcrypt for password hashing

### Frontend
- React 18
- Vite
- TailwindCSS
- Recharts for visualization
- React Router

### Infrastructure
- Docker & Docker Compose
- Nginx (frontend serving)
- MySQL 8.0

## Deployment

The application is containerized and can be deployed with:
```bash
docker-compose up --build
```

All services are configured to start automatically with proper dependencies and health checks.

