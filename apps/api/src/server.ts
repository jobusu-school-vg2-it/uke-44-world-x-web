import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NotFoundError } from './errors/http-error.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const port = Number(process.env.PORT) || 3000;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const webDistDirectory = path.resolve(currentDirectory, '../../web/dist');

// Serve static files
app.use(express.json());
app.use(express.static(webDistDirectory));

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
});

// Demo API
import demoRoutes from './modules/world/world.routes.js';
app.use('/api/world', demoRoutes);

app.use('/api', (_request, _response, _next) => {
    throw new NotFoundError('API route not found.');
});

// Return index.html for client-side routes, but not for API requests.
app.use((request, response, next) => {
    if (
        request.method === 'GET' &&
        !request.path.startsWith('/api/') &&
        request.accepts('html')
    ) {
        response.sendFile(path.join(webDistDirectory, 'index.html'));
        return;
    }

    next();
});

app.use(errorHandler);

app.listen(port, '127.0.0.1', () => {
    console.log(`Server running on http://localhost:${port}/`);
});