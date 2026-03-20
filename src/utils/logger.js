const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info', // Default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json() // Structured logs in JSON format
    ),
    defaultMeta: { service: 'board-system' }, // Optional: tag logs with your service
    transports: [
        new transports.Console(), // Logs to console
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ],
});

// If in development, also log in a readable format to console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

module.exports = logger;