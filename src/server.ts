import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import sessionRoutes from "./routes/session.routes";
import userRoutes from "./routes/user.routes";
import helmet from "helmet";

dotenv.config();

// Initialize Express app
const app: Express = express();

// CORS setup
app.use(cors());
app.use(helmet());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found!"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMesage = "An unknown error occurred!";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMesage = error.message;
  }
  res.status(statusCode).json({ error: errorMesage });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
