# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set the environment variables
ENV POSTGRES_DB=devdb
ENV POSTGRES_USER=devuser
ENV POSTGRES_PASSWORD=devpassword

# Copy the initialization scripts to the container
COPY prisma/init-db.sh /docker-entrypoint-initdb.d/
COPY prisma/generate-test-data.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# Set the default command to run when starting the container
CMD ["postgres"]
