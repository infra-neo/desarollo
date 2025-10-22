# Multi-stage Dockerfile for React application
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
# Note: Using npm install instead of npm ci due to environment compatibility
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Add labels
LABEL maintainer="Ing. Benjamín Frías — DevOps & Cloud Specialist"
LABEL description="Desarollo React Application"
LABEL version="1.0"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
