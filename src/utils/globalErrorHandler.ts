import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'error', 
    format: format.combine(
        format.timestamp(), 
        format.errors({ stack: true }), 
        format.json() 
    ),
    transports: [
        new transports.Console(), 
        new transports.File({ filename: 'error.log' }) 
    ]
});

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error({
        message: message,
        status: statusCode,
        stack: err.stack, 
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    const errorResponse = {
        error: {
            status: statusCode,
            message: message
        }
    };

    res.status(statusCode).json(errorResponse);
}

export default errorHandler;
