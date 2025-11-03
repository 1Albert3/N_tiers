# Base image
FROM php:8.2-apache

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y libpng-dev libonig-dev libzip-dev unzip

# Installer et activer mysqli
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copier fichiers PHP dans le container
COPY ./html /var/www/html/

# Définir ServerName pour supprimer l’avertissement Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Exposer port 80
EXPOSE 80


