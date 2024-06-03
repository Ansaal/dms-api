
# Dealership Management System (DMS)

The Dealership Management System (DMS) is a backend system designed to manage operations for automotive dealerships. It accommodates multiple dealerships, each with their own vehicle inventory, sales records, and customer interactions.

## Features

- Manage multiple dealerships and their hierarchical structures
- Handle vehicle inventory, sales records, and customer interactions
- Authentication and authorization for dealership-specific data access
- GraphQL API for creating, querying, updating, and deleting records

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Docker and Docker Compose installed
- PostgreSQL installed (if not using Docker)


## Tech-Stack
This project uses Nest.js as a backend framework running on node.js using Typescript.
Nest.js provides functionalities that may be required in a productive system out-of-the-box and
maybe the most common used pure-backend framework for node.js.

This project uses prisma to manage the PostgreSQL database.
Prisma provides a type-safe client for accessing our database and manages the database schema.

I decided against using tools like PostGraphile or Hasura, because they are not as easily customizable and it causes
a hard vendor-lock.  
The amount of work with Prisma and type-graphql is acceptable.



## Setup

### 1. Clone the repository

```bash
git clone git@github.com:Ansaal/dms-api.git
cd dms-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Modify the `.env` file in the root directory to set your secret
```
SECRET=your_jwt_secret
```
### 4. Running with Docker Compose

```bash
docker-compose up --build
```

This will start the following services:

- **db**: The PostgreSQL database
- **service**: The NestJS application

### 2. Access the application

The application should now be running at `http://localhost:3000`.  
If you want to start the development-server, shutdown the service docker container and run 
```bash
npm run start:dev
```

## GraphQL API

The GraphQL API is available at `/v1/graphql`. You can use tools like [GraphQL Playground](https://github.com/prisma-labs/graphql-playground) or [Insomnia](https://insomnia.rest/) to interact with the API.
You will need to set an Authorization header with a Bearer token. The token can be optained here:
http://localhost:3000/auth/{dealershipId}
The dealershipId is found in the database. For the provided test-data it would be 9af0e960-bd54-4b8c-bb41-afe36f7322b0

Example:
```json
{
  "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFsZXJzaGlwSWQiOiI5YWYwZTk2MC1iZDU0LTRiOGMtYmI0MS1hZmUzNmY3MzIyYjAiLCJpYXQiOjE3MTczMDcxMDQsImV4cCI6MTcxOTg5OTEwNH0.Nin4m0NxpoMLmdY2KvAIxUYLDFtmO2S7gRpha1ipSTI"
}
```


## Testing

### Running unit tests

```bash
npm run test
```

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or need further assistance, please contact [jhulsch.se@gmail.com](mailto:jhulsch.se@gmail.com).

---

Feel free to customize this README file according to your specific project requirements.
