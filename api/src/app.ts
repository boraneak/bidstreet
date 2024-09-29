import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';
import cookieParser from 'cookie-parser';
import { specs } from '../openApi';
import { rateLimiter, corsOptions, expressSession } from '../middlewares';
import lusca from 'lusca';
import controllers from 'controllers/index';

const app = express();

app.use(rateLimiter);
app.use(corsOptions);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use(expressSession);
app.use(lusca.csrf());

app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/csrf-token', controllers.csrfToken.getCsrfToken);

app.get('/', (_req, res) => {
  res.send('Welcome to the Express server!');
});

export default app;
