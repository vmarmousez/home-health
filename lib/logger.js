const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const formatError = e => (e ? `${e.message} - ${e.stack}` : "");

const customFormat = printf(
  ({ level, message, error, job, timestamp }) =>
    `${timestamp} [${job}] ${level}: ${message}${formatError(error)}}`
);

module.exports = createLogger({
  level: "info",
  format: combine(timestamp(), customFormat),
  transports: [new transports.File({ filename: "output.log", timestamp: true })]
});
