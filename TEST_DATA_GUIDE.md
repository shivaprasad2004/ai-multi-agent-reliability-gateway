# 📊 Test Data Guide

## Overview

Test data has been added to help you verify the application is working correctly. This includes sample requests, metrics, and guardrail violations.

---

## 🚀 Adding Test Data

### Option 1: Automatic (Recommended)

The test data is automatically added when containers start. If you need to add it manually:

**Windows:**
```bash
ADD_TEST_DATA.bat
```

**Manual:**
```bash
docker exec ai-gateway-backend node src/config/seedTestData.js
```

---

## 📋 What Test Data Includes

### 1. Sample Requests (10 requests)
- Various task types: `chat`, `analysis`, `code`
- Different agent roles: `generator`, `safety`, `quality`
- Mix of successful and failed requests
- Some cache hits, some cache misses
- Different latencies (500ms - 2500ms)
- Token usage data
- Timestamps spread over the last hour

### 2. Guardrail Violations (3 violations)
- PII detection example
- Length validation example
- Toxicity filter example

### 3. Test API Key
- Active API key for testing
- Daily limit: 1000 requests
- Linked to admin user

### 4. Additional Providers
- OpenAI provider (disabled - needs API key)
- Gemini provider (disabled - needs API key)

---

## ✅ What You'll See in the Dashboard

### Dashboard Page
- **Total Requests:** 10
- **Success Rate:** 90% (9 successful, 1 error)
- **Cache Hit Rate:** 20% (2 cache hits)
- **Average Latency:** ~1200ms
- **Charts:** Latency trends and token usage

### Requests Page
- Table with 10 sample requests
- Shows different task types
- Shows different agent roles
- Shows cache hit/miss status
- Shows latency and token counts

### Guardrails Page
- 3 sample violations
- Different violation types
- Linked to request IDs

---

## 🧪 Testing the Application

### 1. View Dashboard
1. Login: `admin@example.com` / `Admin123`
2. Go to Dashboard
3. You should see:
   - Metrics cards with numbers
   - Charts showing request trends
   - Recent requests table

### 2. View Requests
1. Go to Requests page
2. You should see 10 sample requests
3. Each shows:
   - Task type
   - Agent role
   - Status (success/error)
   - Latency
   - Cache status

### 3. Test Playground
1. Go to Playground page
2. Enter a prompt (e.g., "What is AI?")
3. Click Send
4. You should get a response from the mock provider

### 4. View Guardrails
1. Go to Guardrails page
2. You should see 3 sample violations
3. Each shows violation type and details

---

## 🔑 Using the Test API Key

The test API key is automatically created. To find it:

1. Login to dashboard
2. Go to API Keys section (if available)
3. Or check the console output when test data is seeded

**To use the API key:**
```bash
curl -X POST http://localhost:4000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -d '{
    "prompt": "Hello, how are you?",
    "taskType": "chat"
  }'
```

---

## 🔄 Resetting Test Data

To clear and re-add test data:

```bash
# Stop containers
docker-compose down

# Remove volumes (clears database)
docker-compose down -v

# Start fresh (will auto-seed)
docker-compose up --build -d

# Or manually add test data
docker exec ai-gateway-backend node src/config/seedTestData.js
```

---

## 📊 Sample Data Details

### Request Distribution
- **Task Types:**
  - `chat`: 6 requests
  - `analysis`: 2 requests
  - `code`: 1 request
  - `error`: 1 request

- **Agent Roles:**
  - `generator`: 5 requests
  - `safety`: 2 requests
  - `quality`: 2 requests

- **Status:**
  - `success`: 9 requests
  - `error`: 1 request

- **Cache:**
  - Cache hits: 2
  - Cache misses: 8

- **Latency Range:**
  - Min: 500ms
  - Max: 2500ms
  - Average: ~1200ms

### Guardrail Violations
1. **PII Detection:** Email pattern found
2. **Length Validation:** Input too long
3. **Toxicity Filter:** Harmful keyword detected

---

## ✅ Verification Checklist

After adding test data, verify:

- [ ] Dashboard shows metrics (not all zeros)
- [ ] Requests page shows 10+ requests
- [ ] Guardrails page shows violations
- [ ] Charts display data
- [ ] Playground can send requests
- [ ] API key is available for testing

---

## 🎯 Next Steps

1. **Explore Dashboard** - See the metrics and charts
2. **View Requests** - Check the sample request data
3. **Test Playground** - Send a test request
4. **Check Guardrails** - Review violation examples
5. **Configure Providers** - Add real API keys if needed

---

**The test data helps you verify everything is working! Check the dashboard to see the sample data.**

