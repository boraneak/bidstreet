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

const ensureEnv = (value: string | undefined, variableName: string): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }
  return value;
};

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: ensureEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
  tokenDuration: process.env.TOKEN_DURATION || '3600',
  nodeEnv: process.env.NODE_ENV || 'development',
  reactAppPort: process.env.REACT_APP_PORT || 3000,
  mongoDbUri: ensureEnv(process.env.MONGODB_URI, 'MONGODB_URI'),
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  sessionSecret: ensureEnv(process.env.SESSION_SECRET, 'SESSION_SECRET'),
};
