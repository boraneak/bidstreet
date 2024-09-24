import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';
import cookieParser from 'cookie-parser';
import { config } from 'config/config';
import { specs } from '../openApi';
import { rateLimiter } from '../middleware';
import lusca from 'lusca';
import session from 'express-session';

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

// Configure session middleware
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  }),
);

app.use(lusca.csrf());

app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (_req, res) => {
  res.send('Welcome to the Express server!');
});

export default app;
