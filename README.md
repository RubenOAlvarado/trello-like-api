## Description

A NestJS API for a Trello-like application built with TypeScript, Prisma, and Swagger. It connects to a PostgreSQL database running in a Docker container.

## Project setup

```bash
$ npm install
```

## Database setup

```bash
# Create a database in PostgreSQL
$ docker-compose up -d
```

## Environment variables
```bash
# Modify the .env file with the following variables
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/DB_NAME?schema=public
```

## Migrations
  
```bash
# Run the migrations
$ npx prisma migrate dev --name "migration_name"
```

## Seed
  
```bash
# Run the seed
$ npx prisma db seed --preview-feature
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

```bash
# Swagger
$ http://localhost:3000/api-docs
```

## Stay in touch

- Author - [Ruben O. Alvarado](https://github.com/RubenOAlvarado)
- Linkedin - [Ruben O. Alvarado](https://www.linkedin.com/in/ruben-alvarado-molina-9020010/)
