# 🔧 Fix: Application Not Running

## 🚨 Quick Fix (Try This First)

### Step 1: Run the Startup Script

**Double-click or run:**
```bash
START_APP.bat
```

This script will:
- ✅ Check if Docker is running
- ✅ Stop any existing containers
- ✅ Build and start all services
- ✅ Wait for services to initialize
- ✅ Check status

---

## 🔍 Manual Fix Steps

If the script doesn't work, follow these steps:

### Step 1: Verify Docker Desktop is Running

1. Open **Docker Desktop**
2. Wait for it to fully start (whale icon should be steady)
3. You should see "Docker Desktop is running"

**If Docker isn't running:**
- Start Docker Desktop
- Wait 1-2 minutes for it to fully initialize
- Try again

---

### Step 2: Open Terminal in Project Folder

1. Navigate to: `C:\Users\shiva\OneDrive\Desktop\AI Multi-Agent Reliability Gateway`
2. Right-click in folder → "Open in Terminal" or "Open PowerShell here"

---

### Step 3: Stop Everything

```bash
docker-compose down
```

---

### Step 4: Start Fresh

```bash
docker-compose up --build
```

**Important:** 
- Keep the terminal window open
- You'll see logs from all services
- Wait until you see:
  - ✅ "Server running on port 4000" (backend)
  - ✅ MySQL "ready for connections"
  - ✅ Frontend nginx started

**This takes 2-3 minutes on first run**

---

### Step 5: Check Status

Open a **new terminal window** and run:

```bash
docker-compose ps
```

**Expected output:**
```
NAME                    STATUS
ai-gateway-mysql        Up (healthy)
ai-gateway-backend      Up (healthy)
ai-gateway-frontend     Up (healthy)
```

---

### Step 6: Test Backend

```bash
curl http://localhost:4000/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

---

### Step 7: Open Browser

Go to: **http://localhost:3000**

---

## 🐛 Common Issues & Fixes

### Issue 1: "Docker is not running"

**Fix:**
1. Open Docker Desktop
2. Wait for it to start (green icon)
3. Try again

---

### Issue 2: "Port already in use"

**Check:**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :4000
```

**Fix:**
- Stop the application using the port
- OR restart your computer
- OR change ports in `docker-compose.yml`

---

### Issue 3: Containers keep stopping

**Check logs:**
```bash
docker-compose logs
```

**Common causes:**
- Database connection failed → Wait longer (MySQL takes time)
- Build errors → Check logs for specific errors
- Insufficient Docker resources → Increase RAM in Docker Desktop settings

**Fix:**
```bash
# Check Docker resources
# Docker Desktop → Settings → Resources
# Ensure 2GB+ RAM allocated

# Clean restart
docker-compose down -v
docker-compose up --build
```

---

### Issue 4: Frontend shows blank page

**Check:**
```bash
docker-compose logs frontend
```

**Look for:**
- Build errors
- nginx errors
- Port binding issues

**Fix:**
```bash
# Rebuild frontend
docker-compose stop frontend
docker-compose rm -f frontend
docker-compose build frontend
docker-compose up -d frontend
```

---

### Issue 5: Backend can't connect to database

**Check:**
```bash
docker-compose logs backend
docker-compose logs mysql
```

**Fix:**
```bash
# Wait longer - MySQL takes 30-60 seconds to initialize
# Check MySQL is healthy
docker-compose ps mysql

# If not healthy, restart MySQL
docker-compose restart mysql
# Wait 30 seconds
docker-compose restart backend
```

---

## ✅ Verification Checklist

After starting, verify:

- [ ] Docker Desktop is running (green icon)
- [ ] `docker-compose ps` shows all 3 services as "Up"
- [ ] `curl http://localhost:4000/health` returns JSON
- [ ] Browser opens http://localhost:3000
- [ ] Login page appears
- [ ] Can login with admin@example.com / Admin123

---

## 🆘 Still Not Working?

### Get Full Diagnostic

Run:
```bash
CHECK_STATUS.bat
```

This will show:
- Docker status
- Container status
- Recent logs
- Port usage
- Connection tests

### Share This Information

1. Run `CHECK_STATUS.bat` and save the output
2. Run `docker-compose logs` and save the output
3. Check Docker Desktop → Settings → Resources (RAM/CPU)

---

## 🎯 Expected Working State

When everything works:

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

Browser: http://localhost:3000 → Login page ✅

---

## 📞 Quick Commands Reference

| Action | Command |
|--------|---------|
| Start | `docker-compose up --build` |
| Start (background) | `docker-compose up --build -d` |
| Stop | `docker-compose down` |
| Restart | `docker-compose restart` |
| View logs | `docker-compose logs -f` |
| Check status | `docker-compose ps` |
| Clean restart | `docker-compose down -v && docker-compose up --build` |

---

**Start with `START_APP.bat` - it will guide you through everything!**

