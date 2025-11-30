# 🔧 Fix: Playground Not Responding

## Problem
Playground is not responding to prompts/labels.

## Root Cause
The playground requires an API key, but it wasn't clear how to get one or use it.

## ✅ Solution Applied

I've updated the Playground component to:
1. **Automatically fetch your API keys** when you open the page
2. **Auto-select the first active API key** if available
3. **Allow creating a new API key** with one click
4. **Show clear error messages** if something goes wrong

---

## 🚀 How to Use Fixed Playground

### Step 1: Open Playground
1. Login to dashboard: http://localhost:3000
2. Go to **Playground** page

### Step 2: API Key (Now Automatic!)
- The playground will **automatically fetch your API keys**
- If you have keys, the first active one will be **auto-selected**
- If you don't have keys, click **"Create New API Key"**

### Step 3: Enter Prompt
1. Enter your prompt in the text area
2. (Optional) Set task type (e.g., "chat", "analysis", "code")
3. Click **"Send"**

### Step 4: Get Response
- You should see the response in the right panel
- Response includes content, latency, tokens, and cache status

---

## 🔍 Troubleshooting

### Issue: "API key is required" error

**Solution:**
1. Click **"Create New API Key"** button
2. Wait for it to be created
3. It will be automatically selected
4. Try sending your prompt again

---

### Issue: "No agents configured" error

**Check:**
1. Go to **Agents** page
2. Ensure you have at least 3 agents:
   - Generator Agent (orderIndex: 0)
   - Safety Agent (orderIndex: 1)
   - Quality Agent (orderIndex: 2)
3. All agents should be linked to enabled models

**Fix:**
- If agents are missing, they should be auto-created on startup
- Restart containers: `docker-compose restart`

---

### Issue: "Pipeline stage failed" error

**Check backend logs:**
```bash
docker-compose logs backend | findstr /C:"error" /C:"Error"
```

**Common causes:**
- Database connection issue
- Model/provider disabled
- Agent configuration issue

**Fix:**
```bash
# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs -f backend
```

---

### Issue: Request hangs/timeout

**Check:**
1. Backend is running: `docker-compose ps`
2. Backend health: `curl http://localhost:4000/health`
3. Backend logs: `docker-compose logs backend`

**Fix:**
```bash
# Restart all services
docker-compose restart

# Wait 60 seconds, then try again
```

---

### Issue: CORS error

**Check:**
- Frontend can reach backend
- nginx proxy is working

**Fix:**
```bash
# Restart frontend
docker-compose restart frontend
```

---

## ✅ Verification Steps

1. **Check API Key:**
   - Playground should show "API Key (✓ Set)" if key is selected
   - Or click "Create New API Key" if needed

2. **Test Simple Prompt:**
   - Enter: "Hello, how are you?"
   - Click Send
   - Should get a response within 2-5 seconds

3. **Check Response:**
   - Response should show content
   - Should show latency (ms)
   - Should show token counts
   - Should show cache hit status

---

## 🧪 Test Examples

### Simple Chat
```
Prompt: "What is artificial intelligence?"
Task Type: chat
```

### Code Generation
```
Prompt: "Write a hello world program in Python"
Task Type: code
```

### Analysis
```
Prompt: "Analyze the benefits of cloud computing"
Task Type: analysis
```

---

## 📊 Expected Response Format

```json
{
  "content": "Response text here...",
  "inputTokens": 10,
  "outputTokens": 50,
  "latencyMs": 1200,
  "cacheHit": false
}
```

---

## 🔄 If Still Not Working

### Full Diagnostic

1. **Check containers:**
   ```bash
   docker-compose ps
   ```
   All should be "Up (healthy)"

2. **Check backend:**
   ```bash
   curl http://localhost:4000/health
   ```
   Should return: `{"status":"ok"}`

3. **Check frontend:**
   ```bash
   curl http://localhost:3000
   ```
   Should return HTML

4. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors when clicking Send

5. **Check network:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Click Send
   - Check the `/api/v1/ai/chat` request
   - Look at response/error

---

## 🎯 Quick Fix Checklist

- [ ] API key is selected/created in playground
- [ ] Prompt is entered
- [ ] Backend is running (`docker-compose ps`)
- [ ] Backend health check passes (`curl http://localhost:4000/health`)
- [ ] Agents are configured (check Agents page)
- [ ] Models are enabled (check Models page)
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

**The playground should now work! Try it with a simple prompt like "Hello" to test.**

