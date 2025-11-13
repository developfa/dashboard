# SSH Server Connection Guide

## Server Information
- **Public IP:** 116.41.178.213
- **SSH Port:** 8897
- **User:** root
- **OS:** Ubuntu 24.04.3 LTS

## Connection Methods

### Method 1: Using SSH Config File (Recommended)
```bash
ssh -F D:\coding\.ssh\config 116.41.178.213
```

### Method 2: Direct Connection with Key
```bash
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213
```

### Method 3: Simple Command (if config is in default location)
```bash
ssh -p 8897 root@116.41.178.213
```

## SSH Keys Location
- **Private Key:** `D:\coding\.ssh\id_rsa_server`
- **Public Key:** `D:\coding\.ssh\id_rsa_server.pub`
- **Config File:** `D:\coding\.ssh\config`

## Quick Connection Script

Create `D:\coding\connect-server.bat`:
```batch
@echo off
ssh -F D:\coding\.ssh\config 116.41.178.213
```

## Common Server Commands

### Check Server Status
```bash
# System information
uname -a
df -h
free -h

# Running services
pm2 status
systemctl status apache2
```

### Project Locations
- **Learn Frontend:** `/var/www/learn-frontend`
- **Learn Backend:** `/var/www/learn-backend`
- **Other Projects:** `/var/www/`

### PM2 Commands
```bash
# Check backend status
pm2 status

# Restart backend
pm2 restart learn-backend

# View logs
pm2 logs learn-backend

# Save PM2 configuration
pm2 save
```

### Apache Commands
```bash
# Check Apache status
sudo systemctl status apache2

# Restart Apache
sudo systemctl restart apache2

# Check Apache configuration
sudo apache2ctl -t

# View error logs
sudo tail -f /var/log/apache2/error.log
```

## Deployment Workflow

### Frontend Deployment
```bash
# Local: Run deployment script
deploy-frontend.bat

# Or manual deployment
cd frontend
npm run build
scp -P 8897 -r dist/* root@116.41.178.213:/var/www/learn-frontend/
```

### Backend Deployment
```bash
# Build locally
cd backend
npm run build

# Upload to server
scp -P 8897 -r dist/* root@116.41.178.213:/var/www/learn-backend/

# On server: Restart PM2
ssh -p 8897 root@116.41.178.213 "pm2 restart learn-backend"
```

## Firewall Configuration
Port 8897/tcp is open on both router and Ubuntu firewall (ufw).

## Security Notes
- SSH key authentication is enabled (password authentication disabled in config)
- Private key is stored in synced folder - ensure Syncthing security
- Server firewall (ufw) is active with necessary ports open
- SSL certificates managed by Let's Encrypt

## Troubleshooting

### Connection Refused
```bash
# Check if server is reachable
ping 116.41.178.213

# Check if SSH port is open
telnet 116.41.178.213 8897
```

### Permission Denied
```bash
# Check key permissions (should be 600 for private key)
ls -la D:\coding\.ssh\id_rsa_server

# Verify correct key is being used
ssh -vvv -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213
```

### Syncthing Not Syncing Keys
- Verify Syncthing is running on both computers
- Check `D:\coding\.ssh` folder exists on office computer
- Ensure file permissions are correct after sync

## Important Files on Server

### Apache Configuration
- Sites available: `/etc/apache2/sites-available/`
- Sites enabled: `/etc/apache2/sites-enabled/`
- Main config: `/etc/apache2/apache2.conf`

### SSL Certificates
- Location: `/etc/letsencrypt/live/`
- Renewal: `sudo certbot renew`

### Environment Variables
- Backend .env: `/var/www/learn-backend/.env`
- Contains Gemini API key and other secrets

## Quick Reference Commands

```bash
# Connect to server
ssh -F D:\coding\.ssh\config 116.41.178.213

# Copy file to server
scp -P 8897 -i D:\coding\.ssh\id_rsa_server local_file root@116.41.178.213:/remote/path/

# Copy file from server
scp -P 8897 -i D:\coding\.ssh\id_rsa_server root@116.41.178.213:/remote/path/file local_path/

# Run command on server without logging in
ssh -p 8897 root@116.41.178.213 "command here"
```

## Network Information
- Home network and server are on the same router
- Port forwarding is configured for external access
- Public IP: 116.41.178.213
- SSH accessible from both local network and external networks

---

**Last Updated:** 2025-10-13
**Maintained by:** Result
