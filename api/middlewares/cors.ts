import cors from 'cors';
import { config } from 'config/index';

const corsOptions = cors({
  origin: `http://localhost:${config.reactAppPort}`,
  credentials: true,
});

export default corsOptions;
