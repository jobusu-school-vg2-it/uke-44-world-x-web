import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

// Custom error handler 
export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
    // Custom error (../errors/)
    if (error instanceof HttpError) {
        response.status(error.status).json({ message: error.message });
        return;
    }

    // Normal error
    if (
        typeof error === 'object'
        && error !== null
        && 'status' in error
        && typeof error.status === 'number'
        && error.status >= 400
        && error.status < 500
    ) {
        response.status(error.status).json({ message: error.message });
        return;
    }

    // Unknown error
    console.error({
        method: request.method,
        path: request.originalUrl,
        error
    });

    response.status(500).json({ message: 'Internal server error' });
};
