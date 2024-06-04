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
    format.printf(({level, timestamp, message}) => {
        return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
);

// Define destination
const transport = [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' })
];