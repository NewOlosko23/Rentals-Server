import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';
import { rateLimiter } from './middleware/rateLimit.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

app.get('/health', (_req, res)=> res.json({ ok: true }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
