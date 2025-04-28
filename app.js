// app.js (корень проекта)
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import itemsRoutes from './routes/itemsRoutes.js';

const app = express();

// ─── API middlewares ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use('/api', itemsRoutes);

// ─── React-статика (client/build) ──────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// путь: <корень-проекта>/client/build
const buildPath = path.join(__dirname, 'client', 'build');

// подключаем статику, только если она реально существует
import { existsSync } from 'fs';
if (existsSync(buildPath)) {
    app.use(express.static(buildPath));

    // SPA-fallback: для любых не-API запросов отдаём index.html
    app.get('*', (_, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// ─── Health-check (удобно для Render) ──────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
