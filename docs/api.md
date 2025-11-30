# API Documentation

## Base URL

- Development: `http://localhost:4000`
- Production: Configure via environment variables

## Authentication

### JWT Authentication
Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### API Key Authentication
Include the API key in the x-api-key header:
```
x-api-key: <api-key>
```

## Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** Same as register

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

### AI Gateway Endpoints

#### Chat
```http
POST /api/v1/ai/chat
Content-Type: application/json
x-api-key: <api-key>

{
  "prompt": "What is artificial intelligence?",
  "taskType": "chat",
  "expectJson": false,
  "jsonSchema": null,
  "maxTokens": 1000,
  "temperature": 0.7,
  "pipelineConfig": {}
}
```

**Request Body:**
- `prompt` (required): The input prompt
- `taskType` (optional): Task type for pipeline routing
- `expectJson` (optional): Whether to expect JSON response
- `jsonSchema` (optional): JSON schema for validation
- `maxTokens` (optional): Maximum tokens in response
- `temperature` (optional): Temperature for generation
- `pipelineConfig` (optional): Pipeline configuration

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Artificial intelligence is...",
    "inputTokens": 10,
    "outputTokens": 50,
    "latencyMs": 1200,
    "cacheHit": false
  }
}
```

### Provider Management

#### List Providers
```http
GET /api/admin/providers
Authorization: Bearer <token>
```

#### Create Provider
```http
POST /api/admin/providers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "openai",
  "baseUrl": "https://api.openai.com/v1",
  "enabled": true
}
```

#### Update Provider
```http
PUT /api/admin/providers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "openai",
  "baseUrl": "https://api.openai.com/v1",
  "enabled": true
}
```

#### Delete Provider
```http
DELETE /api/admin/providers/:id
Authorization: Bearer <token>
```

### Model Management

#### List Models
```http
GET /api/admin/models
Authorization: Bearer <token>
```

#### Create Model
```http
POST /api/admin/models
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerId": 1,
  "modelName": "gpt-3.5-turbo",
  "costPerToken": 0.000002,
  "contextWindow": 4096,
  "enabled": true
}
```

#### Update Model
```http
PUT /api/admin/models/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "providerId": 1,
  "modelName": "gpt-3.5-turbo",
  "costPerToken": 0.000002,
  "contextWindow": 4096,
  "enabled": true
}
```

#### Delete Model
```http
DELETE /api/admin/models/:id
Authorization: Bearer <token>
```

### Agent Management

#### List Agents
```http
GET /api/admin/agents
Authorization: Bearer <token>
```

#### Create Agent
```http
POST /api/admin/agents
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Generator Agent",
  "role": "generator",
  "modelId": 1,
  "orderIndex": 0,
  "taskType": null
}
```

**Agent Roles:**
- `generator`: Initial response generation
- `safety`: PII and toxicity checking
- `quality`: Output polishing

#### Update Agent
```http
PUT /api/admin/agents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Generator Agent",
  "role": "generator",
  "modelId": 1,
  "orderIndex": 0,
  "taskType": null
}
```

#### Reorder Agents
```http
POST /api/admin/agents/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentIds": [1, 2, 3]
}
```

#### Delete Agent
```http
DELETE /api/admin/agents/:id
Authorization: Bearer <token>
```

### Metrics Endpoints

#### Get Summary
```http
GET /api/admin/metrics/summary?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1000,
    "success": 950,
    "errors": 50,
    "cacheHits": 200,
    "cacheHitRate": "20.00",
    "avgLatencyMs": 1200
  }
}
```

#### Get Cache Statistics
```http
GET /api/admin/metrics/cache?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1000,
    "hits": 200,
    "misses": 800,
    "hitRate": "20.00"
  }
}
```

#### Get Latency Statistics
```http
GET /api/admin/metrics/latency?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "avg": 1200,
    "min": 100,
    "max": 5000,
    "p50": 1100,
    "p95": 2500,
    "p99": 4000
  }
}
```

#### List Requests
```http
GET /api/admin/metrics/requests?limit=100&offset=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "apiKeyId": 1,
      "taskType": "chat",
      "providerId": 1,
      "modelId": 1,
      "agentRole": "generator",
      "latencyMs": 1200,
      "inputTokens": 10,
      "outputTokens": 50,
      "status": "success",
      "errorCode": null,
      "cacheHit": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### List Guardrail Violations
```http
GET /api/admin/metrics/guardrails?limit=100&offset=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "requestId": 1,
      "type": "pii",
      "details": "PII detected: email pattern",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### API Key Management

#### List API Keys
```http
GET /api/admin/api-keys
Authorization: Bearer <token>
```

#### Create API Key
```http
POST /api/admin/api-keys
Authorization: Bearer <token>
Content-Type: application/json

{
  "dailyLimit": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "key": "generated-api-key-here",
    "status": "active",
    "dailyLimit": 1000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update API Key
```http
PUT /api/admin/api-keys/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "inactive",
  "dailyLimit": 500
}
```

#### Delete API Key
```http
DELETE /api/admin/api-keys/:id
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

## Rate Limiting

API keys can have daily limits. When exceeded, requests return `429 Too Many Requests`.

## Pagination

List endpoints support pagination:
- `limit`: Number of items per page (default: 100)
- `offset`: Number of items to skip (default: 0)

## Date Filtering

Metrics endpoints support date filtering:
- `startDate`: Start date (ISO 8601 format)
- `endDate`: End date (ISO 8601 format)

