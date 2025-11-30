# 🚨 IMMEDIATE FIX: Connection Refused Error

## Quick Fix Steps (Run These Now)

### Option 1: Restart Everything (Recommended)

```bash
# Stop all containers
docker-compose down

# Start fresh
docker-compose up --build -d

# Wait 60 seconds
# Then check status
docker-compose ps
```

**OR use the fix script:**
```bash
FIX_CONNECTION.bat
```

---

### Option 2: Check What's Wrong

Run the diagnostic script:
```bash
DIAGNOSE.bat
```

This will show you:
- If Docker is running
- Container status
- Recent logs
- Port conflicts

---

## 🔍 Most Common Causes

### 1. Containers Not Started

**Check:**
```bash
docker-compose ps
```

**Fix:**
```bash
docker-compose up -d
```

---

### 2. Frontend Container Failed to Build

**Check:**
```bash
docker-compose logs frontend
```

**Look for:**
- Build errors
- npm install failures
- nginx configuration errors

**Fix:**
```bash
docker-compose down
docker-compose up --build frontend
```

---

### 3. Port 3000 Already in Use

**Check:**
```bash
netstat -ano | findstr :3000
```

**Fix:**
- Stop the application using port 3000
- OR change port in docker-compose.yml:
  ```yaml
  ports:
    - "3001:3000"  # Use 3001 instead
  ```

---

### 4. Docker Resources Insufficient

**Check Docker Desktop:**
- Settings → Resources
- Ensure 2GB+ RAM allocated
- Ensure 2+ CPU cores

**Fix:**
- Increase Docker resources
- Restart Docker Desktop
- Run: `docker-compose up --build`

---

### 5. Frontend Build Failed

**Check logs:**
```bash
docker-compose logs frontend | findstr error
```

**Common issues:**
- Missing dependencies
- Build errors
- nginx config errors

**Fix:**
```bash
# Remove frontend container
docker-compose rm -f frontend

# Rebuild
docker-compose build frontend
docker-compose up -d frontend
```

---

## ✅ Step-by-Step Recovery

### Step 1: Stop Everything
```bash
docker-compose down
```

### Step 2: Clean Up (if needed)
```bash
docker-compose down -v
docker system prune -f
```

### Step 3: Rebuild
```bash
docker-compose build --no-cache
```

### Step 4: Start Services
```bash
docker-compose up -d
```

### Step 5: Monitor Startup
```bash
docker-compose logs -f
```

**Watch for:**
- ✅ "Server running on port 4000" (backend)
- ✅ "nginx" messages (frontend)
- ✅ "ready for connections" (MySQL)

### Step 6: Verify
```bash
# Check status
docker-compose ps

# Test backend
curl http://localhost:4000/health

# Open browser
start http://localhost:3000
```

---

## 🎯 Expected Output

When working correctly:

```bash
$ docker-compose ps
NAME                    STATUS
ai-gateway-mysql        Up (healthy)
ai-gateway-backend      Up (healthy)
ai-gateway-frontend     Up (healthy)
```

```bash
$ curl http://localhost:4000/health
{"status":"ok","timestamp":"2024-..."}
```

Browser: http://localhost:3000 → Login page appears

---

## 🆘 Still Not Working?

### Get Full Diagnostic

```bash
# Run all checks
docker --version
docker ps -a
docker-compose ps
docker-compose logs --tail=50
docker port ai-gateway-frontend
docker port ai-gateway-backend
netstat -ano | findstr :3000
netstat -ano | findstr :4000
```

### Check Specific Container

```bash
# Inspect frontend
docker inspect ai-gateway-frontend

# Check if nginx is running inside
docker exec ai-gateway-frontend ps aux | findstr nginx

# Test nginx config
docker exec ai-gateway-frontend nginx -t
```

### Manual Container Start

```bash
# Start MySQL
docker-compose up -d mysql

# Wait 30 seconds
timeout /t 30

# Start backend
docker-compose up -d backend

# Wait 20 seconds
timeout /t 20

# Start frontend
docker-compose up -d frontend

# Check logs
docker-compose logs -f
```

---

## 📞 Quick Checklist

Before asking for help, verify:

- [ ] Docker Desktop is running (green icon)
- [ ] Ran `docker-compose ps` - shows containers
- [ ] Ran `docker-compose logs frontend` - checked for errors
- [ ] Port 3000 is not used by another app
- [ ] Waited at least 60 seconds after starting
- [ ] Docker has 2GB+ RAM allocated
- [ ] Tried `docker-compose down` then `docker-compose up --build`

---

**Run `FIX_CONNECTION.bat` for automated fix, or follow the steps above manually.**

