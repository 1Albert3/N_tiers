#!/bin/sh
set -e

echo "🚀 Starting Laravel TodoPro Backend..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until php -r "
try {
    new PDO('pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');
    echo 'Connected to database successfully';
    exit(0);
} catch (PDOException \$e) {
    echo 'Database connection failed: ' . \$e->getMessage();
    exit(1);
}
"; do
    echo "Database not ready, waiting 2 seconds..."
    sleep 2
done

echo "✅ Database connection established!"

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating Laravel application key..."
    php artisan key:generate --force
fi

# Clear and cache config
echo "🔧 Optimizing Laravel configuration..."
php artisan config:clear
php artisan config:cache

# Run database migrations
echo "📊 Running database migrations..."
php artisan migrate --force

# Clear and cache routes
echo "🛣️ Optimizing routes..."
php artisan route:clear
php artisan route:cache

# Clear and cache views
echo "👁️ Optimizing views..."
php artisan view:clear
php artisan view:cache

# Create storage link if it doesn't exist
if [ ! -L public/storage ]; then
    echo "🔗 Creating storage symlink..."
    php artisan storage:link
fi

echo "🎉 Laravel TodoPro Backend is ready!"
echo "📡 Starting server on port 8000..."

# Execute the main command
exec "$@"