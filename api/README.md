# Bidstreet API

Bidstreet API built with TypeScript, Node.js, Express and MongoDB. The project uses `ts-node` for development, `typescript` for building, and `eslint` for linting.

## Getting Started

### Prerequisites

- Node.js (>= v18.18.0)
- Yarn (or npm if you prefer)

### Installation

1. Clone the repository:
   ```
   git clone git@github.com:boraneak/bidstreet.git
   cd bidstreet/api
   ```
2. Install the dependencies:

   ```
   yarn install
   ```
   or if you use npm:
   ```
   npm install
   ```
3. Create a .env file in the root directory of the project and add the following environment variables:
   ```
   PORT=your_server_port
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret"
   TOKEN_DURATION=your_jwt_token_duration
   ```

### Available Scripts

In the project directory, you can run the following scripts:

1. Build the project and start the server using the compiled JavaScript files.

      ```
      yarn start
      ```
      or if you use npm:
      ```
      npm run start
      ```

2. Start the server in development mode with hot-reloading using ts-node and nodemon.

      ```
      yarn dev
      ```
      or if you use npm:
      ```
      npm run dev
      ```

3. Run ESLint to check for linting errors in your code.

      ```
      yarn lint
      ```
      or if you use npm:
      ```
      npm run lint
      ```

4. Run ESLint with the --fix option to automatically fix linting errors where possible.

      ```
      yarn lint:fix
      ```
      or if you use npm:
      ```
      npm run lint:fix
      ```

5. Compile the TypeScript files to JavaScript.

      ```
      yarn build
      ```
      or if you use npm:
      ```
      npm run build
      ```
