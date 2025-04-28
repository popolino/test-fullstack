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
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default app;
