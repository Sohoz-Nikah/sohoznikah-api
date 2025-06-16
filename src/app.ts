/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import cron from 'node-cron';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { ContactServices } from './app/modules/Contact/contact.service';
import routes from './app/routes';

const app: Application = express();

// ✅ 1. Configure CORS dynamically using env variables
const allowedOrigins = [
  process.env.FRONTEND_URL_LOCAL || 'http://localhost:3000',
  process.env.FRONTEND_URL_LIVE || 'https://sohoznikah.com',
  process.env.FRONTEND_URL_TEST || 'https://sohoznikah-app-rsh.vercel.app',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// ✅ 2. Enhance Helmet Security Configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable if using inline scripts in frontend
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// ✅ 3. Trust Proxy for HTTPS Redirection (Only in Production)
if (config.node_env === 'production') {
  app.set('trust proxy', 1); // Required when using proxies (e.g., Nginx, Vercel, Heroku)
  app.use((req, res, next) => {
    if (req.protocol !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ✅ 4. Use Body Parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 5. Load API Routes
app.use('/api/v1', routes);

// ✅ 6. Health Check Route
app.get('/', (_req: Request, res: Response) => {
  res
    .status(httpStatus.OK)
    .json({ success: true, message: 'Server is running' });
});

// ✅ 7. Handle Not Found Routes (Before Error Handler)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [{ path: req.originalUrl, message: 'API Not Found' }],
  });
});

// ✅ 8. Global Error Handling Middleware
app.use(globalErrorHandler);

// ✅ 9. Schedule Cron Job for Auto-Cancelling Expired Contactaccess Requests
cron.schedule('0 * * * *', async () => {
  try {
    await ContactServices.checkAndCancelExpiredRequests();
    console.log(
      'Cron job executed: Checked and cancelled expired contact requests.',
    );
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

export default app;
