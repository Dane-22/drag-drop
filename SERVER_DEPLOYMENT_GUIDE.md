# Drag & Drop Site Allocation - Server Deployment Manual (Docker)

Use this procedure to update the **Drag & Drop** application whenever new features or FIXes are pushed to the repository. The application is now fully containerized using Docker.

---

## 1. The "Daily" Code Update

When your colleague says "Code is updated on GitHub," run this sequence:

```bash
# 1. Enter the project directory
cd /var/www/drag_and_drop

# 2. Pull the latest changes from GitHub
git pull origin main

# 3. Build and restart all Docker containers in the background
# This automatically handles npm install and frontend building!
docker-compose up -d --build

# 4. Verify containers are running
docker-compose ps
```

---

## 2. The Database Update

Because your database is shared with other applications (like v2-attendance), **the MySQL database remains installed natively on your server** and is NOT containerized.

If an update includes new database tables or columns, run the SQL import natively on the server just like before:

```bash
# Import the SQL file (replace file.sql with the actual filename)
mysql -u root -p worker_allocation_db < /path/to/your/file.sql
```

---

## 3. Environment Persistence (.env)

Your environment variables are injected into the containers. 

**Backend Configuration:**
Edit the environment variables directly in `docker-compose.yml` under the `backend` service, or pass an `.env` file to Docker. By default, `docker-compose.yml` handles:
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `REDIS_URL`

**Frontend Configuration:**
Before building, ensure the frontend environment variables point to your server IP.
```bash
nano /var/www/drag_and_drop/frontend/.env.local
```
*(Ensure `VITE_API_BASE_URL=http://72.62.254.60:5010/api` and `VITE_WS_URL=http://72.62.254.60:5010` are set here!)*

**Important:** After changing configuration files, recreate the containers:
```bash
docker-compose up -d --build
```

---

## 4. Quick-Reference Table

| Task | Command | Why? |
|------|---------|------|
| Check API/Backend Logs | `docker logs worker_allocation_backend --tail 50 -f` | To see backend/API errors |
| Check Redis Cache Logs | `docker logs worker_allocation_redis -f` | To monitor cache activity |
| Check Database Logs | `docker logs worker_allocation_db -f` | To monitor MySQL |
| Restart All Services | `docker-compose restart` | Soft restart without rebuilding |
| View Container Status | `docker-compose ps` | Ensure all services are running |
| Check Nginx Errors | `sudo tail -f /var/log/nginx/error.log` | To debug 502 Bad Gateway errors |
| Restart Nginx | `sudo systemctl reload nginx` | Apply Nginx config changes |

---

## 5. Summary "One-Liner"

For experienced users, run all update steps in a single command:

```bash
cd /var/www/drag_and_drop && \
git pull origin main && \
docker-compose up -d --build && \
docker-compose ps
```

---

## 6. Troubleshooting Common Issues

### Issue: "Port already in use"
**FIX:** Because other services use ports 5000 and 5001 on this server, `docker-compose.yml` maps the backend to host port `5010`. If `5010` is used, change the left side of the port mapping in `docker-compose.yml` (e.g., `"5011:5000"`).

### Issue: Integration with Attendance Failing
**FIX:** Ensure the API keys match between systems. You can add `SERVICE_API_KEY=your_key` to the backend environment block in `docker-compose.yml`.

### Issue: Frontend shows "Route not found" or Network Errors
**FIX:** Check that the frontend was built with the correct IP address in `frontend/.env.local` before you ran `docker-compose up -d --build`.

---

## 7. Project Structure on Server

```
/var/www/drag_and_drop/
├── docker-compose.yml    # Master infrastructure configuration
├── backend/              # Node.js API (Internal port 5000)
│   ├── Dockerfile 
│   └── server.js      
├── frontend/             # Vite static export (Internal port 5173)
│   └── Dockerfile    
```

---

## 8. Service Ports

| Service | Internal Docker Port | Exposed Host Port | Container Name |
|---------|---------------------|-------------------|----------------|
| Backend API | 5000 | **5010** | worker_allocation_backend |
| Frontend Web | 5173 | **3000** | worker_allocation_frontend |
| Redis Cache | 6379 | **6379** | worker_allocation_redis |

*(Your Nginx reverse proxy routes traffic to host ports 5010 and 3000. MySQL remains natively installed on port 3306).*

---

## 9. Emergency Rollback

If a deployment breaks, quickly revert to the previous version:

```bash
cd /var/www/drag_and_drop
# View previous commits
git log --oneline -5
# Revert to specific commit (replace abc123 with actual commit hash)
git reset --hard abc123
# Rebuild and restart the containers with the old code
docker-compose up -d --build
```

---

## 10. Post-Deployment Verification Checklist

After every deployment, verify:
- [ ] `docker-compose ps` shows all containers (backend, frontend, redis) as "Up"
- [ ] `http://72.62.254.60:3000` loads properly
- [ ] Site allocation dashboard displays successfully
- [ ] The dashboard loads noticeably faster due to the new Redis cache
- [ ] No errors in `docker logs worker_allocation_backend`

---

**Server IP:** 72.62.254.60
