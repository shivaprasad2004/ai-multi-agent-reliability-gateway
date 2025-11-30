# 📊 Large Data & Real-Time Testing Guide

## Overview

Tools for testing the application with large datasets and real-time load testing.

---

## 🚀 Quick Start

### Generate Large Dataset

**Windows:**
```bash
# Generate 1000 requests, 100 violations (default)
GENERATE_LARGE_DATA.bat

# Generate 5000 requests, 500 violations
GENERATE_LARGE_DATA.bat 5000 500

# Generate 10000 requests, 1000 violations
GENERATE_LARGE_DATA.bat 10000 1000
```

**Manual:**
```bash
docker exec ai-gateway-backend node src/scripts/generateLargeData.js 1000 100
```

---

### Run Real-Time Load Test

**Windows:**
```bash
# Test for 60 seconds at 5 requests/second (default)
REALTIME_LOAD_TEST.bat

# Test for 120 seconds at 10 requests/second
REALTIME_LOAD_TEST.bat 120 10

# Test for 5 minutes at 20 requests/second
REALTIME_LOAD_TEST.bat 300 20
```

**Manual:**
```bash
docker exec ai-gateway-backend node src/scripts/realTimeLoadTest.js 60 5
```

---

## 📋 Features

### 1. Large Dataset Generator

Generates realistic test data:
- **Requests:** Various task types, statuses, latencies
- **Guardrail Violations:** Different violation types
- **Time Distribution:** Spread over last 24 hours
- **Realistic Metrics:** Token counts, cache hits, errors

**What it generates:**
- Sample requests with realistic latencies (500-3500ms)
- Mix of success/error statuses (90% success rate)
- Cache hits (20% hit rate)
- Various task types (chat, analysis, code, etc.)
- Guardrail violations linked to requests
- Different agent roles

---

### 2. Real-Time Load Test

Simulates real-time traffic:
- **Configurable Rate:** Requests per second
- **Configurable Duration:** Test length in seconds
- **Real API Calls:** Actually calls your endpoint
- **Performance Metrics:** Latency, success rate, throughput

**Metrics tracked:**
- Total requests
- Success/error counts
- Success rate (%)
- Average latency (ms)
- Actual requests per second
- Total test duration

---

## 🎯 Use Cases

### Scenario 1: Dashboard Testing
```bash
# Generate 5000 requests to test dashboard performance
GENERATE_LARGE_DATA.bat 5000 500
```
Then check:
- Dashboard loading time
- Chart rendering
- Table pagination
- Filter performance

---

### Scenario 2: Real-Time Monitoring
```bash
# Run load test while watching dashboard
REALTIME_LOAD_TEST.bat 300 10
```
Watch in real-time:
- Request metrics updating
- Latency trends
- Error rates
- Cache hit rates

---

### Scenario 3: Stress Testing
```bash
# High load test
REALTIME_LOAD_TEST.bat 60 50
```
Test:
- System under high load
- Database performance
- API response times
- Error handling

---

### Scenario 4: Long-Running Test
```bash
# 10 minute test at moderate rate
REALTIME_LOAD_TEST.bat 600 5
```
Monitor:
- System stability
- Memory usage
- Database growth
- Performance degradation

---

## 📊 Generated Data Characteristics

### Requests Distribution

| Property | Distribution |
|----------|-------------|
| **Task Types** | chat (40%), analysis (30%), code (20%), other (10%) |
| **Status** | success (90%), error (10%) |
| **Cache** | hit (20%), miss (80%) |
| **Latency** | 500-3500ms (normal distribution) |
| **Tokens** | Input: 10-200, Output: 20-500 |
| **Time Range** | Last 24 hours |

### Violations Distribution

| Type | Percentage |
|------|------------|
| PII | 30% |
| Toxicity | 25% |
| Length | 20% |
| Pattern | 15% |
| JSON Schema | 10% |

---

## 🔧 Advanced Usage

### Custom Data Generation

Edit `backend/src/utils/loadTest.js` to customize:
- Prompt templates
- Task type distribution
- Latency ranges
- Error rates
- Cache hit rates

### Custom Load Test

Edit `backend/src/scripts/realTimeLoadTest.js` to:
- Change endpoint
- Modify request payload
- Add custom headers
- Track additional metrics

---

## 📈 Performance Benchmarks

### Expected Performance

**Small Dataset (1K requests):**
- Generation time: ~10 seconds
- Dashboard load: <2 seconds
- Query performance: <500ms

**Medium Dataset (10K requests):**
- Generation time: ~60 seconds
- Dashboard load: <5 seconds
- Query performance: <1 second

**Large Dataset (100K requests):**
- Generation time: ~10 minutes
- Dashboard load: <10 seconds
- Query performance: <2 seconds

---

## 🎯 Testing Scenarios

### 1. Dashboard Performance
```bash
# Generate large dataset
GENERATE_LARGE_DATA.bat 10000 1000

# Check dashboard:
# - Load time
# - Chart rendering
# - Table scrolling
# - Filter speed
```

### 2. Real-Time Updates
```bash
# Start load test
REALTIME_LOAD_TEST.bat 300 10

# Watch dashboard update in real-time
# - Metrics refresh
# - Charts animate
# - Request count increases
```

### 3. Stress Test
```bash
# High rate load test
REALTIME_LOAD_TEST.bat 60 50

# Monitor:
# - Response times
# - Error rates
# - System resources
```

### 4. Endurance Test
```bash
# Long duration test
REALTIME_LOAD_TEST.bat 3600 5

# Monitor for 1 hour:
# - Memory leaks
# - Performance degradation
# - Database growth
```

---

## 🔍 Monitoring During Tests

### Watch Dashboard
- Open dashboard in browser
- Watch metrics update in real-time
- Check charts and graphs
- Monitor request table

### Watch Backend Logs
```bash
docker-compose logs -f backend
```

### Watch Database
```bash
docker exec -it ai-gateway-mysql mysql -u gateway_user -p ai_gateway
# Then: SELECT COUNT(*) FROM requests;
```

### Check Container Resources
```bash
docker stats
```

---

## 📊 Load Test Results Interpretation

### Good Performance
- Success rate: >95%
- Average latency: <2000ms
- No errors in logs
- Stable resource usage

### Warning Signs
- Success rate: <90%
- Average latency: >5000ms
- Increasing error rate
- High memory/CPU usage

### Action Items
- If errors increase: Check backend logs
- If latency high: Check database performance
- If memory high: Check for leaks
- If CPU high: Optimize queries

---

## 🛠️ Troubleshooting

### Issue: Data generation is slow

**Solution:**
- Generate in smaller batches
- Check database performance
- Increase Docker resources

### Issue: Load test fails

**Check:**
- Backend is running
- API key is valid
- Endpoint is correct
- Sufficient resources

**Fix:**
```bash
# Check backend
docker-compose ps backend

# Check logs
docker-compose logs backend

# Restart if needed
docker-compose restart backend
```

### Issue: Dashboard is slow with large data

**Solution:**
- Use pagination (already implemented)
- Add database indexes
- Increase query limits
- Use caching

---

## 📝 Example Workflows

### Complete Testing Workflow

```bash
# 1. Generate initial dataset
GENERATE_LARGE_DATA.bat 5000 500

# 2. Check dashboard performance
# Open http://localhost:3000 and verify

# 3. Run real-time load test
REALTIME_LOAD_TEST.bat 120 10

# 4. Monitor dashboard updates
# Watch metrics change in real-time

# 5. Generate more data
GENERATE_LARGE_DATA.bat 10000 1000

# 6. Verify dashboard still performs well
```

---

## ✅ Best Practices

1. **Start Small:** Begin with 1K requests, then scale up
2. **Monitor Resources:** Watch Docker stats during tests
3. **Check Logs:** Monitor backend logs for errors
4. **Test Incrementally:** Increase load gradually
5. **Document Results:** Note performance at different scales

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Generate 1K requests | `GENERATE_LARGE_DATA.bat 1000 100` |
| Generate 10K requests | `GENERATE_LARGE_DATA.bat 10000 1000` |
| Load test 60s @ 5rps | `REALTIME_LOAD_TEST.bat 60 5` |
| Load test 5min @ 20rps | `REALTIME_LOAD_TEST.bat 300 20` |
| Watch logs | `docker-compose logs -f backend` |
| Check stats | `docker stats` |

---

**You now have powerful tools for large-scale and real-time testing!**

