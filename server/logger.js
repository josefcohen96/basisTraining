const winston = require('winston');

// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL || 'debug',
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;
