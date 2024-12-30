import cors from 'cors';
import { config } from 'config/index';

const corsOptions = cors({
  origin: `http://localhost:${config.reactAppPort}`,
  credentials: true,
});
// console.log(`CORS options set to allow requests from http://localhost:${config.reactAppPort}`);
export default corsOptions;
