import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectToDatabase } from '../database';
import router from './routes/index';
import cookieParser from 'cookie-parser';
import { getCurrentDate } from '../utils/getCurrentDate';
import { config } from 'config/config';
import { specs } from '../openApi';
import { rateLimiter } from '../middleware';

const app = express();
const port = config.port;
app.use(rateLimiter);
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
  // console.log(JSON.stringify(specs, null, 2));
  await connectToDatabase();
  console.log(`Express is listening at http://localhost:${port}`);
});
