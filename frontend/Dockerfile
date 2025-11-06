# Multi-stage optimized Dockerfile for React Frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application with optimizations
RUN npm run build

# Production stage with optimized nginx
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built app
COPY --from=builder /app/build /usr/share/nginx/html

# Copy optimized nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx user and set permissions
RUN addgroup -g 1000 nginx-app && adduser -u 1000 -G nginx-app -s /bin/sh -D nginx-app \
    && chown -R nginx-app:nginx-app /usr/share/nginx/html \
    && chown -R nginx-app:nginx-app /var/cache/nginx \
    && chown -R nginx-app:nginx-app /var/log/nginx

# Health check optimized
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]