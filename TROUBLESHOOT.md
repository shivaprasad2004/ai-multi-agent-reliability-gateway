# 🔧 Troubleshooting: Connection Refused Error

## Problem: `ERR_CONNECTION_REFUSED` at localhost:3000

This means the frontend container isn't running or the port isn't accessible.

---

## 🔍 Diagnostic Steps

### Step 1: Check if Docker is Running

```bash
docker --version
docker ps
```

**If error:** Start Docker Desktop and wait for it to fully start.

---

### Step 2: Check Container Status

```bash
docker-compose ps
```

**Expected:** All 3 services should show "Up" status

**If empty or stopped:**
```bash
# Start services
docker-compose up -d

# Or rebuild everything
docker-compose up --build -d
```

---

### Step 3: Check Frontend Container

```bash
# Check if frontend container exists
docker ps -a | findstr frontend

# Check frontend logs
docker-compose logs frontend

# Check if port 3000 is listening
netstat -ano | findstr :3000
```

---

### Step 4: Check Backend Container

```bash
# Check backend logs
docker-compose logs backend

# Test backend health
curl http://localhost:4000/health
```

---

### Step 5: Check All Logs

```bash
# View all logs
docker-compose logs --tail=100

# Follow logs in real-time
docker-compose logs -f
```

---

## 🛠️ Solutions

### Solution 1: Restart All Services

```bash
# Stop everything
docker-compose down

# Start fresh
docker-compose up --build -d

# Wait 60 seconds, then check
docker-compose ps
```

---

### Solution 2: Check Port Conflicts

```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Check what's using port 4000
netstat -ano | findstr :4000

# If something else is using the port, stop it or change ports in docker-compose.yml
```

---

### Solution 3: Rebuild Frontend

```bash
# Stop frontend
docker-compose stop frontend

# Remove frontend container
docker-compose rm -f frontend

# Rebuild and start
docker-compose up --build -d frontend

# Check logs
docker-compose logs -f frontend
```

---

### Solution 4: Check Docker Resources

**Docker Desktop → Settings → Resources:**
- Ensure at least 2GB RAM allocated
- Ensure at least 2 CPU cores
- Restart Docker Desktop if needed

---

### Solution 5: Clean Start

```bash
# Stop and remove everything
docker-compose down -v

# Remove all containers
docker container prune -f

# Rebuild from scratch
docker-compose up --build

# Keep terminal open to see logs
```

---

### Solution 6: Check Windows Firewall

1. Open Windows Defender Firewall
2. Check if Docker/port 3000 is blocked
3. Add exception if needed

---

## 🔍 Common Issues

### Issue: Containers start then stop immediately

**Check logs:**
```bash
docker-compose logs
```

**Common causes:**
- Database connection failed
- Port already in use
- Insufficient Docker resources
- Build errors

---

### Issue: Frontend builds but doesn't serve

**Check nginx:**
```bash
docker exec -it ai-gateway-frontend nginx -t
docker exec -it ai-gateway-frontend cat /etc/nginx/conf.d/default.conf
```

---

### Issue: Backend can't connect to database

**Check MySQL:**
```bash
docker-compose logs mysql
docker exec -it ai-gateway-mysql mysqladmin ping -h localhost
```

**Wait longer** - MySQL takes 30-60 seconds to initialize.

---

## ✅ Verification Commands

Run these to verify everything is working:

```bash
# 1. Check all services are up
docker-compose ps

# 2. Test backend
curl http://localhost:4000/health

# 3. Test frontend (from inside container)
docker exec ai-gateway-frontend wget -O- http://localhost:3000

# 4. Check port bindings
docker port ai-gateway-frontend
docker port ai-gateway-backend
```

---

## 🚨 Still Not Working?

### Get Detailed Information

```bash
# Full diagnostic
docker-compose ps
docker-compose logs --tail=200
docker info
docker version

# Check specific container
docker inspect ai-gateway-frontend
docker inspect ai-gateway-backend
```

### Alternative: Run Services Individually

```bash
# Start MySQL first
docker-compose up -d mysql

# Wait 30 seconds, then start backend
docker-compose up -d backend

# Wait 10 seconds, then start frontend
docker-compose up -d frontend
```

---

## 📞 Quick Fix Checklist

- [ ] Docker Desktop is running (green icon)
- [ ] All containers show "Up" in `docker-compose ps`
- [ ] Port 3000 is not used by another application
- [ ] Frontend logs show nginx started successfully
- [ ] Backend logs show "Server running on port 4000"
- [ ] MySQL logs show "ready for connections"
- [ ] Windows Firewall allows Docker
- [ ] Docker has enough resources (2GB+ RAM)

---

## 🎯 Expected Working State

When everything is working:

```bash
$ docker-compose ps
NAME                    STATUS
ai-gateway-mysql        Up (healthy)
ai-gateway-backend      Up (healthy)  
ai-gateway-frontend     Up (healthy)
```

```bash
$ curl http://localhost:4000/health
{"status":"ok","timestamp":"..."}
```

Browser: http://localhost:3000 → Shows login page

---

**Run the diagnostic commands above and share the output for further help!**

