import dotenv from 'dotenv';
import path from 'path';

// Determine which .env file to use based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.prod'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.dev';

// Load the appropriate .env file
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  tokenDuration: process.env.TOKEN_DURATION,
  nodeEnv: process.env.NODE_ENV,
  reactAppPort: process.env.REACT_APP_PORT || 3000,
};
