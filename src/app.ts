import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { globalErrorHandler } from "./middlewares/globalError.middleware";
import authRouter from "./routes/auth.routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
