import fs from 'fs';
import path from 'path';
import { createLogger, transports, format } from 'winston';

// Define severity levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Set current level
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format
const commonFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ level, timestamp, message }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  })
);
const consoleFormat = format.combine(
  commonFormat,
  format.colorize({
    all: true,
    colors: {
      error: 'red', 
      warn: 'white', 
      info: 'white', 
      http: 'white', 
      debug: 'white'
    }
  })    
);
const fileFormat = format.combine(
  commonFormat,
  format.uncolorize()    
);


// Define file paths
const __dirname = path.resolve();
const logFolderPath = path.join(__dirname, 'logs');
if (!fs.existsSync(logFolderPath)) {
  fs.mkdirSync(logFolderPath, { recursive: true });
}
const errorFilePath = path.join(logFolderPath, 'errors.log');
const exceptionFilePath = path.join(logFolderPath, 'exceptions.log');

// Define destination
const logTransport = [
  new transports.Console({ format: consoleFormat }),
  new transports.File({ filename: errorFilePath, level: 'error', format: fileFormat })
];

// Define logger
const logger = createLogger({
  level: level(), //default level
  levels: levels,
  format: commonFormat,
  transports: logTransport,
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: exceptionFilePath })
  ]
});

export default logger;