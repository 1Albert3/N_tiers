#!/bin/sh
set -e

echo "Starting Laravel backend..."

# Copier .env si nécessaire
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Générer la clé si nécessaire
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

echo "Starting server..."
exec "$@"