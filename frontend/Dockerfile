# Multi-stage Dockerfile for Infrastructure Builder Frontend
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

# Stage 1: Build the application  
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a simple nginx config for SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Add labels
LABEL maintainer="Ing. Benjamín Frías — DevOps & Cloud Specialist"
LABEL description="Desarollo Infrastructure Builder Frontend"
LABEL version="1.0"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
