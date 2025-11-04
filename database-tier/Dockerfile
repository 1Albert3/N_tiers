FROM postgres:15-alpine

# Install additional tools
RUN apk add --no-cache curl

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Create non-root user for better security
RUN addgroup -g 999 postgres_group && \
    adduser -u 999 -G postgres_group -s /bin/sh -D postgres_user

# Set proper permissions
RUN chown -R postgres:postgres /var/lib/postgresql/data

EXPOSE 5432

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-postgres} || exit 1