# 📋 Action Plan - Run the Application

## 🎯 Goal
Get the AI Multi-Agent Reliability Gateway running on your machine in Docker.

---

## ✅ Pre-Flight Checklist

Before starting, verify:

- [ ] **Docker Desktop installed** ✓
- [ ] **Docker Desktop running** ✓ (green whale icon)
- [ ] **Terminal/Command Prompt open** ✓
- [ ] **In project directory** ✓

---

## 🚀 Execution Steps

### STEP 1: Verify Docker
```
Open Docker Desktop → Check it says "Running"
```

### STEP 2: Navigate to Project
```bash
cd "C:\Users\shiva\OneDrive\Desktop\AI Multi-Agent Reliability Gateway"
```

### STEP 3: Start Application

**Windows:**
```bash
START.bat
```

**Mac/Linux:**
```bash
./START.sh
```

**OR Manual:**
```bash
docker-compose up --build
```

### STEP 4: Wait for Startup
- **Time:** 30-60 seconds
- **Watch for:** "healthy" status in logs
- **Look for:** "Server running on port 4000"

### STEP 5: Verify Services
```bash
docker-compose ps
```

**Expected Output:**
```
NAME                    STATUS
ai-gateway-mysql        Up (healthy)
ai-gateway-backend      Up (healthy)
ai-gateway-frontend     Up (healthy)
```

### STEP 6: Open Application
1. Open browser
2. Go to: **http://localhost:3000**
3. You should see: Login page

### STEP 7: Login
- **Email:** `admin@example.com`
- **Password:** `Admin123`
- Click "Login"

### STEP 8: Success! 🎉
You should now see the Dashboard.

---

## 🔍 Verification Checklist

After starting, verify:

- [ ] All services show "healthy" in `docker-compose ps`
- [ ] Backend responds: `curl http://localhost:4000/health`
- [ ] Frontend loads: http://localhost:3000
- [ ] Can login successfully
- [ ] Dashboard displays

---

## 🛠️ Common Commands

| Action | Command |
|--------|---------|
| View logs | `docker-compose logs -f` |
| Stop all | `docker-compose down` |
| Restart | `docker-compose restart` |
| Check status | `docker-compose ps` |
| Rebuild | `docker-compose up --build` |

---

## ⚠️ Troubleshooting

### Issue: Port Already in Use
```bash
docker-compose down
# Then start again
```

### Issue: Services Won't Start
```bash
# Check logs
docker-compose logs

# Clean restart
docker-compose down -v
docker-compose up --build
```

### Issue: Can't Connect to Database
```bash
# Wait longer (database takes time to initialize)
# Check MySQL logs
docker-compose logs mysql
```

---

## 📍 Access Points

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:4000 | 4000 |
| **MySQL** | localhost:3306 | 3306 |

---

## 🔑 Credentials

| Type | Value |
|------|-------|
| **Admin Email** | admin@example.com |
| **Admin Password** | Admin123 |
| **DB User** | gateway_user |
| **DB Password** | gateway_pass |

---

## 📚 Next Steps

Once running:

1. **Explore Dashboard** - View metrics and charts
2. **Test Playground** - Try the AI endpoint
3. **Configure Providers** - Add OpenAI/Gemini keys
4. **Review Agents** - Check pipeline configuration
5. **Monitor Requests** - View API call logs

---

## 📖 Additional Resources

- **[QUICK_START.md](QUICK_START.md)** - Detailed guide with troubleshooting
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Production checklist

---

**Total Time:** ~5 minutes from start to running application

**Need Help?** Check the troubleshooting section or view logs: `docker-compose logs -f`

