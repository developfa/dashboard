# Personal Task Dashboard - Project Context

## Project Overview
Flask-based task management dashboard with PostgreSQL database, deployed on remote server.

## Server Information
- **Host**: 116.41.178.213
- **SSH Port**: 8897
- **User**: root
- **App Directory**: /opt/personal-task-dashboard
- **App Port**: 8001
- **Public URL**: http://116.41.178.213:8001

## Database Configuration
- **Type**: PostgreSQL
- **Database**: personal_task_dashboard
- **User**: dashboard_user
- **Password**: MyVeryStrongDBPass2025wjdwl
- **Connection String**: postgresql://dashboard_user:MyVeryStrongDBPass2025wjdwl@localhost/personal_task_dashboard

## Current Status

### Active Issues
1. **DB Schema Mismatch**: Column `users.memo_color_labels` missing in database
   - Error occurs on login: `psycopg2.errors.UndefinedColumn: column users.memo_color_labels does not exist`
   - Need to run migration or add column manually

2. **Port Conflict**: Port 8001 has multiple instances trying to bind
   - Need to identify and kill existing process before starting new one

### Running Processes (Background SSH Sessions)
- **b5a864**: Production run attempt (failed - port in use)
- **8b89ef**: Log monitoring (killed/disconnected)
- **dd9315**: Development run attempt (completed - port in use)

## Deployment Workflow

### Local to Server Deployment
```bash
# Run from project root
deploy.bat
```

### Manual Deployment Steps
1. **Upload files via SCP**:
   ```bash
   scp -P 8897 -r . root@116.41.178.213:/opt/personal-task-dashboard
   ```

2. **Install dependencies** (if requirements changed):
   ```bash
   ssh -p 8897 root@116.41.178.213 "cd /opt/personal-task-dashboard && source venv/bin/activate && pip install -r requirements.txt"
   ```

3. **Stop existing process**:
   ```bash
   ssh -p 8897 root@116.41.178.213 "pkill -f 'python.*run.py' || true"
   ```

4. **Start application**:
   ```bash
   ssh -p 8897 root@116.41.178.213 "cd /opt/personal-task-dashboard && source venv/bin/activate && FLASK_ENV=production DATABASE_URL=postgresql://dashboard_user:MyVeryStrongDBPass2025wjdwl@localhost/personal_task_dashboard PORT=8001 nohup python run.py > flask.log 2>&1 &"
   ```

## Database Fixes Needed

### Add Missing Column
```sql
ALTER TABLE users ADD COLUMN memo_color_labels TEXT;
```

Or run via SSH:
```bash
ssh -p 8897 root@116.41.178.213 "psql -U dashboard_user -d personal_task_dashboard -c 'ALTER TABLE users ADD COLUMN memo_color_labels TEXT;'"
```

## Key Files
- **app.py**: Main Flask application
- **models.py**: Database models
- **run.py**: Application entry point
- **deploy.bat**: Deployment script
- **requirements.txt**: Python dependencies

## Next Steps
1. Fix database schema (add memo_color_labels column)
2. Properly stop existing processes before redeployment
3. Consider using systemd or supervisor for process management
