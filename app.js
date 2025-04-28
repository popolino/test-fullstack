// server/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import itemsRoutes from './routes/itemsRoutes.js';

const app = express();

// ─── API middlewares ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use('/api', itemsRoutes);

// ─── Статика React (build лежит в client/build) ────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// путь: <корень-проекта>/client/build
const buildPath = path.join(__dirname, '..', 'client', 'build');

// отдаём всё, что лежит в build
app.use(express.static(buildPath));

// для всех остальных путей ‒ index.html (SPA-fallback)
app.get('*', (_, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// ─── Экспорт ───────────────────────────────────────────────────────────────────
export default app;
