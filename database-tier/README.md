# Base de données PostgreSQL pour l'application Todo List

Ce dossier contient la configuration et les scripts d'initialisation de la base de données PostgreSQL pour l'application Todo List.

## Structure

- `Dockerfile` : Configuration du conteneur PostgreSQL
- `init.sql` : Script d'initialisation de la base de données
- `postgresql.conf` : Configuration optimisée de PostgreSQL

## Tables principales

### Users
- id (PK)
- name
- email (unique)
- password
- timestamps

### Tasks
- id (PK)
- title
- description
- is_completed
- priority
- due_date
- user_id (FK)
- timestamps

## Configuration

La base de données est configurée avec :
- Support UTF-8
- Timezone UTC
- Optimisations pour les performances
- Journalisation détaillée
- Auto-vacuum configuré

## Variables d'environnement

- POSTGRES_DB=todo_db
- POSTGRES_USER=todo_user
- POSTGRES_PASSWORD=todo_password

## Utilisation

### Construction de l'image
```bash
docker build -t todo-db .
```

### Démarrage du conteneur
```bash
docker run -d \
  --name todo-db \
  -p 5432:5432 \
  -e POSTGRES_DB=todo_db \
  -e POSTGRES_USER=todo_user \
  -e POSTGRES_PASSWORD=todo_password \
  todo-db
```

### Connexion à la base de données
```bash
psql -h localhost -U todo_user -d todo_db
```