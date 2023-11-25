import winston from "winston";

/**
 * Formatting and colorize logger info
 */
export const logger = winston.createLogger({
  format: winston.format.combine(winston.format.prettyPrint(), winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});
