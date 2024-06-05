import path from 'path';
import fs from 'fs';
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
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
};

// Define format
const logFormat = format.combine(
    format.colorize({
        all: false,
        colors: {error: 'red'}
    }),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.errors({ stack: true }),
    format.printf(({level, timestamp, message, stack}) => {
        const msg = `${timestamp} [${level.toUpperCase()}] ${message}`;
        return stack ? `${msg}\nTraceback:\n${stack}` : msg;
    })
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
    new transports.Console(),
    new transports.File({ filename: errorFilePath, level: 'error' })
];

// Define logger
const logger = createLogger({
    level: level(),  //default level
    levels,
    logFormat,
    logTransport,
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({ filename: exceptionFilePath })
    ]
});

export default logger;