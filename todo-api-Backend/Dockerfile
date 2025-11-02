FROM php:8.2-cli-alpine

# Installation des dépendances système
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Création d'un utilisateur non-root
RUN addgroup -g 1000 laravel && adduser -u 1000 -G laravel -s /bin/sh -D laravel

# Configuration du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers de dépendances
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Copie du reste des fichiers
COPY . .
RUN composer dump-autoload --optimize

# Configuration des permissions
RUN chown -R laravel:laravel /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copie du script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Changement vers l'utilisateur non-root
USER laravel

# Exposer le port
EXPOSE 8000

# Point d'entrée
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]