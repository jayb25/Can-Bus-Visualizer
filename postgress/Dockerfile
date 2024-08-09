# Use the official PostgreSQL Alpine image from Docker Hub
FROM postgres:alpine

# Set environment variables
ENV POSTGRES_DB=mydatabase
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword

# Copy the initialization scripts if any (optional)
# ADD init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
