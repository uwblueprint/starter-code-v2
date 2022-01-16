import * as winston from "winston";

type Logger = {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  http: (message: string) => void;
  verbose: (message: string) => void;
  debug: (message: string) => void;
};

const WinstonLogger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  WinstonLogger.add(new winston.transports.Console());
}

const logger = (fileName: string): Logger => {
  return {
    error: (message: string) => {
      WinstonLogger.error(`[${fileName}] ${message}`);
    },
    warn: (message: string) => {
      WinstonLogger.warn(`[${fileName}] ${message}`);
    },
    info: (message: string) => {
      WinstonLogger.info(`[${fileName}] ${message}`);
    },
    http: (message: string) => {
      WinstonLogger.http(`[${fileName}] ${message}`);
    },
    verbose: (message: string) => {
      WinstonLogger.verbose(`[${fileName}] ${message}`);
    },
    debug: (message: string) => {
      WinstonLogger.debug(`[${fileName}] ${message}`);
    },
  };
};

export default logger;
