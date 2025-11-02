FROM postgres:15-alpine

# Copie des scripts d'initialisation
COPY ./init.sql /docker-entrypoint-initdb.d/

# Configuration de PostgreSQL
COPY ./postgresql.conf /etc/postgresql/postgresql.conf

# Variables d'environnement par défaut
ENV POSTGRES_DB=todo_db \
    POSTGRES_USER=todo_user \
    POSTGRES_PASSWORD=todo_password

# Expose le port PostgreSQL
EXPOSE 5432

# Commande pour démarrer PostgreSQL avec la configuration personnalisée
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]