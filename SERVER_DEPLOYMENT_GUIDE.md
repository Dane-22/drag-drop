# Drag & Drop Site Allocation - Server Deployment Manual

Use this procedure to update the **Drag & Drop** application whenever new features or FIXes are pushed to the repository.

---

## 1. The "Daily" Code Update

When your colleague says "Code is updated on GitHub," run this sequence:

```bash
# 1. Enter the project directory
cd /var/www/drag-drop

# 2. Pull the latest changes from GitHub
git fetch origin master
git reset --hard origin/master

# 3. Install any new dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# 4. Build the frontend (using your Server IP)
# Replace YOUR_SERVER_IP with your actual IP address
cd ../frontend
echo "VITE_API_BASE_URL=http://YOUR_SERVER_IP:5010/api" > .env.local
echo "VITE_WS_URL=http://YOUR_SERVER_IP:5010" >> .env.local
npm run build

# 5. Restart PM2 services
pm2 restart dragdrop-api --update-env
pm2 restart dragdrop-web --update-env

# 6. Verify services are running
pm2 status
```

---

## 2. The Database Update

If the update includes new database tables or columns:

**SQL Import (since Drag&Drop uses raw MySQL queries):**
```bash
# Import the SQL file (replace file.sql with the actual filename)
mysql -u root -p worker_allocation_db < /path/to/your/file.sql

# Verify: Check if new tables exist
mysql -u root -p -e "USE worker_allocation_db; SHOW TABLES;"
```

---

## 3. Environment Persistence (.env)

Your `.env` files are critical and are **NOT** tracked by Git (they are in `.gitignore`). They will remain intact during deployments.

**Backend .env location:**
```bash
/var/www/drag-drop/backend/.env
```
*(Ensure `PORT=5010`, `SERVICE_API_KEY`, and `V2_ATTENDANCE_API_URL` (e.g. `http://72.62.254.60:5002`) are set here!)*

**Frontend .env.local location:**
```bash
/var/www/drag-drop/frontend/.env.local
```

**V2 Attendance Backend .env location:**
```bash
/var/www/version2_attendance/backend/.env
```
*(Ensure `SITE_ALLOCATION_API_URL=http://localhost:5010` is set here so it can talk to the drag&drop backend!)*

If you ever need to change environment variables, edit these files directly:
```bash
nano /var/www/drag-drop/backend/.env
nano /var/www/drag-drop/frontend/.env.local
```

**Important:** After changing `.env` files, restart the services:
```bash
pm2 restart dragdrop-api --update-env
pm2 restart dragdrop-web --update-env
```

---

## 4. Quick-Reference Table

| Task | Command | Why? |
|------|---------|------|
| Check for API Errors | `pm2 logs dragdrop-api --lines 20` | To see why the backend is failing |
| Check Nginx Errors | `sudo tail -f /var/log/nginx/error.log` | To debug 500/502 errors |
| Test Nginx Config | `sudo nginx -t` | To ensure config is valid before reloading |
| Check PM2 Status | `pm2 status` | To verify both services are running |
| Monitor API Logs | `pm2 logs dragdrop-api` | Real-time backend monitoring |
| Monitor Web Logs | `pm2 logs dragdrop-web` | Real-time frontend monitoring |
| Check .env Files | `ls -la /var/www/drag-drop/backend/.env` | Confirm env files exist |
| Restart Nginx | `sudo systemctl reload nginx` | Apply Nginx config changes |

---

## 5. Summary "One-Liner"

For experienced users, run all update steps in a single command (make sure to replace `YOUR_SERVER_IP` with your actual IP):

```bash
cd /var/www/drag-drop && \
git fetch origin master && \
git reset --hard origin/master && \
npm install && \
cd backend && npm install && \
cd ../frontend && npm install && echo "VITE_API_BASE_URL=http://YOUR_SERVER_IP:5010/api" > .env.local && echo "VITE_WS_URL=http://YOUR_SERVER_IP:5010" >> .env.local && npm run build && \
pm2 restart dragdrop-api --update-env && pm2 restart dragdrop-web --update-env && \
pm2 status
```

---

## 6. Troubleshooting Common Issues

### Issue: "Port already in use" (EADDRINUSE)
**FIX:** Because Docker heavily uses ports 5000 and 5001 on this server, ensure your backend `.env` is set to `PORT=5010`.
```bash
cat /var/www/drag-drop/backend/.env | grep PORT
# Should output: PORT=5010
```

### Issue: Integration with Attendance Failing (403 Forbidden)
**FIX:** Ensure the `SERVICE_API_KEY` matches exactly between both backends:
```bash
cat /var/www/drag-drop/backend/.env | grep SERVICE_API_KEY
cat /var/www/version2_attendance/backend/.env | grep SITE_ALLOCATION_API_KEY
```

### Issue: Frontend shows "Route not found" or Network Errors
**FIX:** Check that the frontend was built with the correct IP address and port:
```bash
cat /var/www/drag-drop/frontend/.env.local
# Should show: VITE_API_BASE_URL=http://YOUR_SERVER_IP:5010/api
```

---

## 7. Project Structure on Server

```
/var/www/drag-drop/
├── backend/           # Node.js API (port 5010)
│   ├── .env          # Database, JWT & SERVICE_API_KEY config
│   └── server.js     # Entry point
├── frontend/          # Vite static export (port 3000)
│   ├── .env.local    # API URL config
│   └── dist/         # Static build files
```

---

## 8. Service Ports

| Service | Port | Process Name |
|---------|------|--------------|
| Backend API | 5010 | dragdrop-api |
| Frontend Web | 3000 | dragdrop-web |
| Docker | 5000, 5001 | docker-proxy |
| MySQL | 3306 | mysql |

---

## 9. Emergency Rollback

If a deployment breaks, quickly revert to the previous version:

```bash
cd /var/www/drag-drop
# View previous commits
git log --oneline -5
# Revert to specific commit (replace abc123 with actual commit hash)
git reset --hard abc123
# Rebuild and restart
cd frontend && npm run build
pm2 restart all
```

---

## 10. Post-Deployment Verification Checklist

After every deployment, verify:
- [ ] `pm2 status` shows both services as "online"
- [ ] `http://YOUR_SERVER_IP:3000` loads properly
- [ ] Site allocation dashboard displays successfully
- [ ] Integration: Clock-in from `v2-attendance` successfully validates against this API
- [ ] No errors in `pm2 logs`

---

**Server IP:** (Update to your actual server IP)
