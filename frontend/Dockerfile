# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]