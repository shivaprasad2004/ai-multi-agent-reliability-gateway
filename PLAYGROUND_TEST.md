# 🧪 Playground Testing Guide

## Quick Test

1. **Open Playground:** http://localhost:3000/playground
2. **API Key:** Should auto-select or click "Create New API Key"
3. **Enter Prompt:** "Hello, how are you?"
4. **Click Send**
5. **Expected:** Response within 2-5 seconds

---

## What Changed

### Before:
- API key was "optional" but actually required
- No way to easily get/create API key
- Unclear error messages

### After:
- ✅ Automatically fetches your API keys
- ✅ Auto-selects first active key
- ✅ One-click API key creation
- ✅ Clear error messages
- ✅ Better user experience

---

## Test Scenarios

### Test 1: Basic Chat
```
Prompt: "What is AI?"
Task Type: (leave empty or "chat")
Expected: Response with AI explanation
```

### Test 2: With Task Type
```
Prompt: "Write a Python function to add two numbers"
Task Type: "code"
Expected: Code response
```

### Test 3: Analysis
```
Prompt: "Analyze the pros and cons of remote work"
Task Type: "analysis"
Expected: Analysis response
```

---

## Common Issues & Fixes

### "API key is required"
→ Click "Create New API Key" button

### "No agents configured"
→ Check Agents page, ensure 3 agents exist

### "Pipeline stage failed"
→ Check backend logs: `docker-compose logs backend`

### Request timeout
→ Check backend is running: `docker-compose ps`

---

**The playground is now fixed and should work!**

