# ✅ Quick Test - Verify Application is Working

## 🚀 Test Data Added Automatically

When you start the application, test data is automatically added so you can verify everything is working!

---

## 📊 What You'll See

### Dashboard (http://localhost:3000)
After logging in, you'll see:
- ✅ **Total Requests:** 10 (not zero!)
- ✅ **Cache Hit Rate:** 20%
- ✅ **Average Latency:** ~1200ms
- ✅ **Charts** with data points
- ✅ **Recent Requests** table with sample data

### Requests Page
- ✅ 10 sample requests showing:
  - Different task types (chat, analysis, code)
  - Different agent roles (generator, safety, quality)
  - Success and error statuses
  - Cache hits and misses
  - Latency and token data

### Guardrails Page
- ✅ 3 sample violations:
  - PII detection example
  - Length validation example
  - Toxicity filter example

---

## 🧪 Quick Test Steps

### 1. Start Application
```bash
docker-compose up -d
```

Wait 60 seconds for services to start and test data to be added.

### 2. Open Dashboard
- Go to: http://localhost:3000
- Login: `admin@example.com` / `Admin123`

### 3. Verify Data
- **Dashboard:** Should show metrics (not all zeros)
- **Requests:** Should show 10 requests
- **Guardrails:** Should show 3 violations
- **Charts:** Should display data

### 4. Test Playground
- Go to Playground page
- Enter prompt: "What is artificial intelligence?"
- Click Send
- Should get a response from mock provider

---

## 🔄 Add Test Data Manually (If Needed)

If test data wasn't added automatically:

**Windows:**
```bash
ADD_TEST_DATA.bat
```

**Manual:**
```bash
docker exec ai-gateway-backend node src/config/seedTestData.js
```

---

## 📋 Test Data Summary

| Item | Count | Description |
|------|-------|-------------|
| Requests | 10 | Sample API requests with metrics |
| Guardrail Violations | 3 | PII, length, toxicity examples |
| Providers | 3 | Mock (enabled), OpenAI, Gemini (disabled) |
| Models | 1 | mock-basic (enabled) |
| Agents | 3 | Generator, Safety, Quality |
| API Keys | 1 | Test API key for admin user |

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Dashboard shows numbers (not zeros)
- ✅ Charts display data
- ✅ Requests table has entries
- ✅ Guardrails page shows violations
- ✅ Playground returns responses

---

## 🎯 What the Test Data Shows

### Request Types:
- **chat** - 6 requests (most common)
- **analysis** - 2 requests
- **code** - 1 request
- **error** - 1 request (to show error handling)

### Performance Metrics:
- **Average Latency:** ~1200ms
- **Cache Hit Rate:** 20%
- **Success Rate:** 90%
- **Token Usage:** Varied (15-300 tokens)

### Guardrail Examples:
- **PII:** Email pattern detection
- **Length:** Input validation
- **Toxicity:** Harmful content filter

---

## 🔑 Test API Key

A test API key is automatically created. To find it:

1. Check console output when containers start
2. Or login and check API Keys section (if available)

**Use it to test the API:**
```bash
curl -X POST http://localhost:4000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"prompt": "Hello!", "taskType": "chat"}'
```

---

## 📖 Full Documentation

See [TEST_DATA_GUIDE.md](TEST_DATA_GUIDE.md) for complete details.

---

**The test data helps you verify the application is working correctly!**

**Just start the app and check the dashboard - you'll see data immediately!**

