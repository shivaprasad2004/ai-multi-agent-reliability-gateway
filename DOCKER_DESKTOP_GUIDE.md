# 🐳 Starting Containers from Docker Desktop

## Current Status
✅ Docker Desktop is running  
❌ Containers are stopped

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Containers

**Option A: From Docker Desktop**
1. In Docker Desktop, find the container "aimulti-agentreli"
2. Click the **Play button (▶)** next to it
3. Wait 30-60 seconds

**Option B: From Command Line**
```bash
docker-compose up -d
```

---

### Step 2: Verify Containers Are Running

**In Docker Desktop:**
- Refresh the page (or wait for auto-refresh)
- You should see 3 containers running:
  - `ai-gateway-mysql` (green/running)
  - `ai-gateway-backend` (green/running)
  - `ai-gateway-frontend` (green/running)

**Or check status:**
```bash
docker-compose ps
```

---

### Step 3: Access Application

1. Wait 60 seconds for services to fully start
2. Open browser: **http://localhost:3000**
3. Login: `admin@example.com` / `Admin123`

---

## 🔍 What You Should See

### In Docker Desktop:

**Before Starting:**
- Container shows grey icon
- Status: Stopped
- No ports listed

**After Starting:**
- Container shows green icon
- Status: Running
- Ports: `3000->3000/tcp`, `4000->4000/tcp`, `3306->3306/tcp`

### Container List Should Show:

| Name | Status | Ports |
|------|--------|-------|
| ai-gateway-frontend | Running | 0.0.0.0:3000->3000/tcp |
| ai-gateway-backend | Running | 0.0.0.0:4000->4000/tcp |
| ai-gateway-mysql | Running | 0.0.0.0:3306->3306/tcp |

---

## ⚠️ If Containers Don't Start

### Check Logs in Docker Desktop:
1. Click on the container name
2. Go to "Logs" tab
3. Look for errors

### Common Issues:

**Issue: Container starts then stops immediately**
- Check logs for errors
- Common: Database connection failed
- Solution: Wait longer (MySQL takes 30-60 seconds to initialize)

**Issue: Port already in use**
- Another application is using port 3000 or 4000
- Solution: Stop that application or change ports

**Issue: Out of resources**
- Docker Desktop → Settings → Resources
- Increase RAM to 4GB+
- Restart Docker Desktop

---

## 🎯 Expected Timeline

1. **0-10 seconds:** Containers start
2. **10-30 seconds:** MySQL initializes
3. **30-45 seconds:** Backend connects to database
4. **45-60 seconds:** Frontend serves application
5. **60+ seconds:** Application ready at http://localhost:3000

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ All 3 containers show "Running" in Docker Desktop
- ✅ Ports are listed (3000, 4000, 3306)
- ✅ CPU/Memory usage shows activity
- ✅ Browser opens http://localhost:3000 successfully
- ✅ Login page appears

---

## 🛠️ Useful Docker Desktop Features

### View Logs:
1. Click container name
2. Click "Logs" tab
3. See real-time logs

### Restart Container:
1. Click container name
2. Click "Restart" button

### Stop Container:
1. Click container name
2. Click "Stop" button

### View Resource Usage:
- Bottom status bar shows RAM, CPU, Disk usage
- Container list shows per-container CPU/Memory

---

## 📞 Quick Commands

If you prefer command line:

```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f

# Restart all
docker-compose restart

# Check status
docker-compose ps
```

---

**Right now, just click the Play button (▶) next to your container in Docker Desktop!**

