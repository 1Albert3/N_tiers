#!/bin/sh
set -e

echo "Starting Laravel backend..."

# Attendre PostgreSQL
echo "Waiting for PostgreSQL..."
sleep 10

# Exécuter les migrations
echo "Running migrations..."
php artisan migrate --force 2>/dev/null || echo "Migrations will be created later"

echo "Starting server..."
exec "$@"