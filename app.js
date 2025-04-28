import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import itemsRoutes from './routes/itemsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', itemsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const buildPath = path.join(__dirname, 'client', 'build');

import { existsSync } from 'fs';
if (existsSync(buildPath)) {
    app.use(express.static(buildPath));

    app.get('*', (_, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
