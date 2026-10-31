import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pino from "pino";
import pinoHttp from "pino-http";
import helmet from "helmet";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import { gatewayAuth } from "./middlewares/gatewayAuth.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
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
  }),
);

app.use(
  "/auth",
  proxy(process.env.AUTH_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
      return "/auth" + req.url;
    },
  }),
);

app.use(
  "/chat",
  gatewayAuth,
  proxy(process.env.CHAT_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
      return "/chat" + req.url;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.id;
      }

      return proxyReqOpts;
    },
  }),
);

app.use(
  "/agent",
  gatewayAuth,
  proxy(process.env.AGENT_SERVICE_URL, {
    proxyReqPathResolver: function (req) {
      return "/agent" + req.url;
    },
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.id;
      }
      return proxyReqOpts;
    },
  }),
);

// app.use("/billing", gatewayAuth, proxy(process.env.BILLING_SERVICE_URL, {
//   proxyReqPathResolver: function(req) {
//     return "/billing" + req.url;
//   },
//   proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
//     if (srcReq.user) {
//       proxyReqOpts.headers["x-user-id"] = srcReq.user.id;
//       proxyReqOpts.headers["x-user-name"] = srcReq.user.name || "";
//       proxyReqOpts.headers["x-user-email"] = srcReq.user.email || "";
//       proxyReqOpts.headers["x-user-avatar"] = srcReq.user.avatar || "";
//       proxyReqOpts.headers["x-authenticated"] = "true";
//     }
//     return proxyReqOpts;
//   }
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Gateway is running", status: "ok" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
