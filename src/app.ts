/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import routes from "./app/routes";
import helmet from "helmet";
import config from "./app/config";

const app: Application = express();

// ✅ 1. Configure CORS dynamically using env variables
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ 2. Enhance Helmet Security Configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable if using inline scripts in frontend
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ 3. Trust Proxy for HTTPS Redirection (Only in Production)
if (config.node_env === "production") {
  app.set("trust proxy", 1); // Required when using proxies (e.g., Nginx, Vercel, Heroku)
  app.use((req, res, next) => {
    if (req.protocol !== "https") {
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
app.use("/api/v1", routes);

// ✅ 6. Health Check Route
app.get("/", (_req: Request, res: Response) => {
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Server is running" });
});

// ✅ 7. Handle Not Found Routes (Before Error Handler)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [{ path: req.originalUrl, message: "API Not Found" }],
  });
});

// ✅ 8. Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
