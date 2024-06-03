# Use the official Node.js image as the base image
FROM node:18-alpine

# Install netcat and postgresql-client for database readiness check and SQL execution
RUN apk add --no-cache netcat-openbsd postgresql-client

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy Prisma schema and migration scripts
COPY prisma /app/prisma

# Build the NestJS project
RUN npm run build

# Copy the init-db.sh script
COPY prisma/init-db.sh /app/init-db.sh
RUN chmod +x /app/init-db.sh

# Expose the port that the application will run on
EXPOSE 3000

# Set the command to run the application
CMD ["/bin/sh", "/app/init-db.sh"]
