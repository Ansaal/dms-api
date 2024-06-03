#!/bin/sh

# Wait for the PostgreSQL database to be ready
until nc -z -v -w30 db 5432
do
  echo "Waiting for PostgreSQL database connection..."
  sleep 1
done
echo "PostgreSQL database is up and running"

# Run Prisma migrations
npx prisma migrate deploy

# Execute the SQL file for test data
PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/generate-test-data.sql

# Start the NestJS application
npm run start:prod
