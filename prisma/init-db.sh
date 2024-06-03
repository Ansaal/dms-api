#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - running migrations and seeding data"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database with test data..."
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/prisma/generate-test-data.sql


npx prisma generate

echo "Starting NestJS application..."
npm run start:prod
