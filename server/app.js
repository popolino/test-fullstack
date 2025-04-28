import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import itemsRoutes from './routes/itemsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', itemsRoutes);


const buildPath = path.join(process.cwd(), 'client', 'build');

app.use(express.static(buildPath));
app.get('*', (_, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

export default app;
