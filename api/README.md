# Bidstreet API

## Getting Started

### Prerequisites

- Node.js (>= v18.18.0)

### Installation

0. Change directory:
   ```
   cd bidstreet/api
   ```
1. Install the dependencies:
   ```
   npm install
   ```
2. Create a .env.dev
   ```
   cp .env.dev.example .env.dev
   ```

### Available Scripts

In the project directory, you can run the following scripts:

0.  Start the server in development mode with hot-reloading using ts-node and nodemon.
    ```
    npm run dev
    ```
1.  Run ESLint to check for linting errors in your code.
    ```
    npm run lint
    ```
2.  Run ESLint with the --fix option to automatically fix linting errors where possible.
    ```
    npm run lint:fix
    ```
3.  Compile the TypeScript files to JavaScript.
    ```
    npm run build
    ```
4.  Test
    ```
    npm run test
    ```

### Database Migrations

- To apply all pending migrations:

```
npm run migrate:up
```

- To revert the last migration:

```
npm run migrate:down
```

- To check migration status

```
npm run migrate:status
```

### API Documentation

The API documentation is available and accessible via Swagger at the following route after starting the server:

```
http://localhost:<your_server_port>/api-docs
```

This documentation provides details on all the available API endpoints, request/response formats, and more. Ensure the server is running to access the interactive docs.
