import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';
import cookieParser from 'cookie-parser';
import { config } from 'config/config';
import { specs } from '../openApi';
import { rateLimiter, expressSession } from '../middlewares';
import lusca from 'lusca';
import { ICSRFTokenRequest } from 'interfaces/requests/CSRFTokenRequest';

const app = express();

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

app.use(expressSession);
app.use(lusca.csrf());

app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/csrf-token', (req: Request, res: Response) => {
  const csrfToken = (req as ICSRFTokenRequest).csrfToken();
  res.json({ csrfToken });
});

app.get('/', (_req, res) => {
  res.send('Welcome to the Express server!');
});

export default app;
