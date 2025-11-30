# 🚀 Quick Start Guide - Action Plan

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Docker Desktop** installed and running
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: Open Docker Desktop and ensure it's running (green status)

- [ ] **Git** (optional, if cloning from repository)
- [ ] **Terminal/Command Prompt** access

---

## Step-by-Step Action Plan

### Step 1: Verify Docker is Running

**Windows:**
- Open Docker Desktop
- Wait for it to fully start (whale icon in system tray)
- You should see "Docker Desktop is running" in the app

**Mac/Linux:**
```bash
docker --version
docker ps
```

If you see version info and no errors, Docker is ready ✅

---

### Step 2: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project:

```bash
cd "C:\Users\shiva\OneDrive\Desktop\AI Multi-Agent Reliability Gateway"
```

Or if you're on Mac/Linux:
```bash
cd "/path/to/AI Multi-Agent Reliability Gateway"
```

---

### Step 3: Start the Application

**Option A: Using Startup Script (Easiest)**

**Windows:**
```bash
START.bat
```

**Mac/Linux:**
```bash
./START.sh
```

**Option B: Manual Docker Compose Command**

```bash
docker-compose up --build
```

**What happens:**
1. Docker builds all container images
2. Starts MySQL database
3. Waits for database to be healthy
4. Runs database migrations
5. Seeds admin user and mock provider
6. Starts backend server
7. Starts frontend server

**Expected output:**
- You'll see logs from all services
- Look for "Server running on port 4000" (backend)
- Look for "nginx" messages (frontend)
- Wait until you see all services are "healthy"

---

### Step 4: Wait for Services to Start

**Wait time:** 30-60 seconds for first startup

**How to verify services are ready:**

**Check service status:**
```bash
docker-compose ps
```

You should see:
- `ai-gateway-mysql` - Up (healthy)
- `ai-gateway-backend` - Up (healthy)
- `ai-gateway-frontend` - Up (healthy)

**Test backend:**
```bash
curl http://localhost:4000/health
```

Expected response: `{"status":"ok","timestamp":"..."}`

**Test frontend:**
Open browser: http://localhost:3000

---

### Step 5: Access the Application

1. **Open your web browser**
2. **Navigate to:** http://localhost:3000
3. **You should see:** Login page

---

### Step 6: Login

**Default Admin Credentials:**
- **Email:** `admin@example.com`
- **Password:** `Admin123`

Click "Login" button

---

### Step 7: Explore the Dashboard

Once logged in, you'll see:

- **Dashboard** - Overview with charts and metrics
- **Requests** - View all API requests
- **Providers** - Manage LLM providers (OpenAI, Gemini, Mock)
- **Models** - Manage AI models
- **Agents** - Configure multi-agent pipeline
- **Guardrails** - View safety violations
- **Playground** - Test the AI endpoint

---

## 🛠️ Troubleshooting

### Problem: Docker won't start

**Solution:**
- Ensure Docker Desktop is installed and running
- Restart Docker Desktop
- Check system requirements

---

### Problem: Port already in use

**Error:** `port is already allocated` or `address already in use`

**Solution:**
```bash
# Stop existing containers
docker-compose down

# Or stop specific service using the port
# Check what's using port 3000, 4000, or 3306
# Windows: netstat -ano | findstr :4000
# Mac/Linux: lsof -i :4000
```

---

### Problem: Backend can't connect to database

**Error:** `ECONNREFUSED` or database connection errors

**Solution:**
```bash
# Check if MySQL is running
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Restart services
docker-compose restart
```

---

### Problem: Frontend shows blank page or errors

**Solution:**
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

---

### Problem: Services keep restarting

**Solution:**
```bash
# View all logs to find the error
docker-compose logs

# Check specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

---

## 📊 Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild Everything
```bash
docker-compose down
docker-compose up --build
```

### Check Service Status
```bash
docker-compose ps
```

### Access Database
```bash
docker exec -it ai-gateway-mysql mysql -u gateway_user -p
# Password: gateway_pass
```

---

## ✅ Success Indicators

You know everything is working when:

1. ✅ All services show "healthy" in `docker-compose ps`
2. ✅ Backend health check returns: `{"status":"ok"}`
3. ✅ Frontend loads at http://localhost:3000
4. ✅ You can login with admin credentials
5. ✅ Dashboard shows metrics (may be empty initially)
6. ✅ Playground can send test requests

---

## 🎯 Next Steps After Running

1. **Create an API Key:**
   - Go to API Keys section (if available in UI)
   - Or use admin credentials to generate via API

2. **Test the AI Endpoint:**
   - Go to Playground page
   - Enter a prompt
   - Click "Send"
   - You should get a response (using mock provider by default)

3. **Configure Providers:**
   - Add OpenAI API key in Providers section
   - Add Gemini API key if needed
   - Create models for each provider

4. **Configure Agents:**
   - Review default agents (Generator, Safety, Quality)
   - Adjust order if needed
   - Assign models to agents

5. **Monitor Metrics:**
   - Check Dashboard for request statistics
   - View Requests table for detailed logs
   - Monitor Guardrails for violations

---

## 🆘 Still Having Issues?

1. **Check Docker resources:**
   - Docker Desktop → Settings → Resources
   - Ensure enough CPU/Memory allocated (min 2GB RAM)

2. **Check system requirements:**
   - Windows 10/11, MacOS 10.15+, or Linux
   - At least 4GB free RAM
   - At least 10GB free disk space

3. **View detailed logs:**
   ```bash
   docker-compose logs --tail=100
   ```

4. **Clean restart:**
   ```bash
   docker-compose down -v  # Removes volumes too
   docker-compose up --build
   ```

---

## 📝 Quick Reference

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:4000 | 4000 |
| MySQL | localhost:3306 | 3306 |

| Credential | Value |
|------------|-------|
| Email | admin@example.com |
| Password | Admin123 |
| DB User | gateway_user |
| DB Password | gateway_pass |

---

**That's it! You're ready to run the application.** 🎉

