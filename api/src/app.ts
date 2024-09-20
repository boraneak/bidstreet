import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import specs from '../swagger';
import { connectToDatabase } from '../database';
import router from './routes/index';
import cookieParser from 'cookie-parser';
import { getCurrentDate } from '../utils/date';
import { rateLimit } from 'express-rate-limit';
import { config } from 'config/config';
const app = express();
const port = config.port;

// Set up rate limiter: maximum of five requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // max 5 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);
app.use(
  cors({
    origin: `http://localhost:${config.reactAppPort}`,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'Server is healthy and running!',
    status: 'OK',
    date: getCurrentDate(),
  });
});

app.get('/', (_req, res) => {
  res.send('Welcome to the Express server!');
});

app.listen(port, async () => {
  console.log('Current NODE_ENV:', config.nodeEnv);
  await connectToDatabase();
  console.log(`Express is listening at http://localhost:${port}`);
});
