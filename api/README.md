# Bidstreet API

Bidstreet API built with TypeScript, Node.js, Express and MongoDB. The project uses `ts-node` for development, `typescript` for building, and `eslint` for linting.

## Getting Started

### Prerequisites

- Node.js (>= v18.18.0)
- Yarn (or npm if you prefer)

### Installation

0. Change directory:
   ```
   cd bidstreet/api
   ```
1. Install the dependencies:
   ```
   yarn install
   ```
   or if you use npm:
   ```
   npm install
   ```
2. Create a .env file in the root directory of the project and add the following environment variables:
   ```
   PORT=your_server_port
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret"
   TOKEN_DURATION=your_jwt_token_duration
   REACT_APP_PORT=3000
   ```
### Available Scripts

In the project directory, you can run the following scripts:

0. Build the project and start the server using the compiled JavaScript files.
      ```
      yarn start
      ```
      or if you use npm:
      ```
      npm run start
      ```
1. Start the server in development mode with hot-reloading using ts-node and nodemon.
      ```
      yarn dev
      ```
      or if you use npm:
      ```
      npm run dev
      ```
2. Run ESLint to check for linting errors in your code.
      ```
      yarn lint
      ```
      or if you use npm:
      ```
      npm run lint
      ```
3. Run ESLint with the --fix option to automatically fix linting errors where possible.
      ```
      yarn lint:fix
      ```
      or if you use npm:
      ```
      npm run lint:fix
      ```
4. Compile the TypeScript files to JavaScript.
      ```
      yarn build
      ```
      or if you use npm:
      ```
      npm run build
      ```

### Database Migrations

- To apply all pending migrations:
```
npm run migrate:up
```
or if you use yarn:
```
yarn migrate:up
```
- To revert the last migration:
```
npm run migrate:down
```
or if you use yarn:
```
yarn migrate:down
```
- To check migration status
```
npm run migrate:status
```
or if you use yarn:
```
yarn migrate:status
```
