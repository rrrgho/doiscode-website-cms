# Deployment Guide

This guide explains how to deploy the Doiscode CMS project securely to a Virtual Private Server (VPS) using Docker and an Apache Reverse Proxy.

## Prerequisites
- A VPS running Linux (Ubuntu/Debian recommended)
- `docker` and `docker-compose` installed
- `apache2` installed with proxy modules enabled
- A PostgreSQL database (can be hosted on the same VPS or externally)
- Domain name pointing to your VPS IP

## Project Structure
This project uses a multi-stage Dockerfile optimized for Next.js standalone output.
- `docker-compose.yml`: Binds the container port 3000 to the host port 3000 and maps your environment variables.
- `Dockerfile`: Builds the Node.js dependencies, generates Prisma client, builds the Next.js standalone app, and serves it on port 3000 securely as a non-root user.
- `next.config.ts`: Must have `output: "standalone"` enabled.

---

## Step-by-Step Deployment

### 1. Enable Apache Proxy Modules
Ensure your Apache server has the necessary proxy modules enabled to forward traffic to Docker:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

### 2. Clone the Repository
SSH into your VPS and pull the latest codebase into your preferred web directory (e.g., `/var/www/doiscode`):
```bash
cd /var/www/doiscode
git clone https://github.com/rrrgho/doiscode-website-cms.git .
```

*(If already cloned, just run `git pull origin main`)*

### 3. Create the Environment File
The `docker-compose.yml` file expects certain environment variables to run. Do not commit these to Git!
Create a `.env` file in the root of the project:
```bash
nano .env
```
Paste your production credentials:
```env
DATABASE_URL="postgresql://username:password@your_db_host:5432/your_database"
JWT_SECRET="your-own-random-super-secret-production-key"
```

### 4. Build and Start the Docker Container
Run the following command to build the Docker image and start the container in detached (background) mode.
*(Depending on your Docker installation, it might be `docker compose` or `docker-compose`)*.

```bash
sudo docker-compose up -d --build
```
This will take a few minutes. To verify it is running on port 3000, run:
```bash
sudo docker ps
```

### 5. Configure Apache Reverse Proxy
Create an Apache configuration file for your domain (e.g., `temp.doiscode.com`):
```bash
sudo nano /etc/apache2/sites-available/doiscode.conf
```
Paste the following, swapping out your actual domain:
```apache
<VirtualHost *:80>
    ServerName temp.doiscode.com
    # ServerAlias www.temp.doiscode.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/doiscode_error.log
    CustomLog ${APACHE_LOG_DIR}/doiscode_access.log combined
</VirtualHost>
```

### 6. Enable the Site and Restart Apache
Enable your new site configuration and restart Apache so the reverse proxy takes effect:
```bash
sudo a2ensite doiscode.conf
sudo systemctl restart apache2
```

---

## Database Migrations
If you've made changes to the `schema.prisma` file, you need to apply them to your production database.

**Option 1: Execute inside the running container**
```bash
sudo docker exec -it doiscode-cms npx prisma db push
```

**Option 2: Run locally and push to production DB**
Run this locally before deployment if your production DB is publicly accessible:
```bash
npx prisma db push
```

## Updating Your Project
When you make changes locally and push them to your repository, follow these steps on your VPS to deploy the updates:

1. **Pull the latest code:**
   ```bash
   cd /var/www/doiscode # Or your project directory
   git pull origin main
   ```

2. **Rebuild and restart the container:**
   The `--build` flag is crucial here; it forces Docker to install any new dependencies and create a fresh Next.js production build with your new code.
   ```bash
   sudo docker-compose up -d --build
   ```

3. **(Optional) Run database migrations:**
   If your update included changes to `schema.prisma`, apply them:
   ```bash
   sudo docker exec -it doiscode-cms npx prisma db push
   ```

## Troubleshooting
- **Website shows 502 Bad Gateway:** The Docker container is likely not running or crashed. Check the logs:
  ```bash
  sudo docker logs doiscode-cms
  ```
- **Updates aren't showing:** Make sure you rebuild the image after pulling new code:
  ```bash
  git pull
  sudo docker-compose up -d --build
  ```
