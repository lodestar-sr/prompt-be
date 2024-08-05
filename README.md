# 📌 PMS API

This is the backend component of the Prompt Management Application. It is built using Node.js, Express, and NestJS, and it provides RESTful APIs for managing writing prompts. The backend uses Redis and Postgres for efficient data storage and retrieval.

## 🔍 Table of Contents

- [📁 Project Structure](#-project-structure)

- [📝 Project Summary](#-project-summary)

- [💻 Stack](#-stack)

- [⚙️ Setting Up](#%EF%B8%8F-setting-up)

- [🚀 Run Locally](#-run-locally)

## 📁 Project Structure

```bash
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── common
│   ├── config
│   ├── database
│   ├── modules
│   │   ├── auth
│   │   ├── common
│   │   ├── prompt
│   │   └── user
│   ├── app.module.ts
│   ├── main.ts
│   ├── metadata.ts
├── tsconfig.build.json
└── tsconfig.json
```

## 📝 Project Summary

- [src](src): Main source code directory.
- [src/common](src/common): Contains common code used throughout the project.
- [src/config](src/config): Stores project configuration files.
- [src/database](src/database): Handles database-related functionality (such as migrations, seeds).
- [src/modules/auth](src/modules/auth): Contains authentication-related code.
- [src/modules/common](src/modules/common): Contains common code used throughout modules.
- [src/modules/prompt](src/modules/prompt): Handles prompt-related functionality.
- [src/modules/user](src/modules/user): Handles user-related functionality.

## 💻 Stack

- [nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt): JWT authentication for NestJS projects.
- [nestjs/passport](https://www.npmjs.com/package/@nestjs/passport): Passport authentication for NestJS projects.
- [nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger): Swagger documentation for NestJS projects.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Password hashing and comparison.
- [nestjs/typeorm](https://www.npmjs.com/package/@nestjs/typeorm): TypeORM integration for NestJS projects.
- [nestjs/platform-express](https://www.npmjs.com/package/@nestjs/platform-express): Platform adapter for NestJS
  applications using Express.
- [nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger): Swagger module for NestJS to automatically generate
  API documentation.
- [nestjs/throttler](https://www.npmjs.com/package/@nestjs/throttler): Request throttling module for NestJS.
- [nestjs/config](https://www.npmjs.com/package/@nestjs/config): Configuration module for NestJS applications.

## ⚙️ Setting Up

To run this project, you will need to add the following environment variables to your `.env` file in root folder

```.env
DATABASE_URL=
PORT=8000

# Security
CORS_ENABLED= # Optional
CORS_ORIGIN= # Optional

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

#Redis
REDIS_HOST=
REDIS_PASSWORD= # Optional
REDIS_PORT=
```

## 🚀 Run Locally

1. Clone the auction-backend repository:

```bash
cd pms-backend
```

2. Install the dependencies:

```bash
pnpm install
```

3. Run migrations:

```bash
pnpm typeorm:migration:run
```

4. Start the development mode:

```bash
pnpm start:dev
```
