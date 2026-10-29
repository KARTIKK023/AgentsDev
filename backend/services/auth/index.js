import express from "express";

import dotenv from "dotenv";
import pino from "pino";
import pinoHttp from "pino-http";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
 

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
const logger = pino({
    level: "info",
  
    // Pretty output only in development.
    transport: false
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: true,
          },
        },
  });
app.use(
    pinoHttp({
      logger,
      autoLogging: true,
  
      // Keep request logs concise.
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
  
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
  
      customSuccessMessage: (req, res) =>
        `${req.method} ${req.url} → ${res.statusCode}`,
  
      customErrorMessage: (req, res) =>
        `${req.method} ${req.url} → ${res.statusCode}`,
  
      customProps: () => ({
        service: "auth",
      }),
    })
  );

app.use("/auth", authRoutes);

app.get("/auth", (req, res) => {
    res.status(200).json({ message: "auth is running", status: "ok" });
});

app.listen(process.env.PORT, () => {
    console.log(`auth is running on port ${process.env.PORT}`);
    connectDB();
});
