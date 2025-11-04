# Build stage
FROM php:8.2-cli-alpine AS builder

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    postgresql-dev \
    zip \
    unzip \
    git

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application code
COPY . .
RUN composer dump-autoload --optimize

# Production stage
FROM php:8.2-cli-alpine

# Install runtime dependencies only
RUN apk add --no-cache \
    bash \
    postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Create non-root user
RUN addgroup -g 1000 laravel && adduser -u 1000 -G laravel -s /bin/sh -D laravel

WORKDIR /var/www/html

# Copy built application from builder stage
COPY --from=builder --chown=laravel:laravel /var/www/html .

# Copy entrypoint script
COPY --chown=laravel:laravel docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set proper permissions
RUN chmod -R 755 storage bootstrap/cache

USER laravel
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]