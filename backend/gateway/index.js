import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pino from "pino";
import pinoHttp from "pino-http";
import helmet from "helmet";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}));
app.use(cookieParser());
app.use(helmet());
const logger = pino({
    level: "info",
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
        service: "gateway",
      }),
    })
  );

// Forward /auth routes to auth service - preserve full path
app.use("/auth", proxy(process.env.AUTH_SERVICE_URL, {
  proxyReqPathResolver: function(req) {
    return "/auth" + req.url;
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Gateway is running", status: "ok" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
