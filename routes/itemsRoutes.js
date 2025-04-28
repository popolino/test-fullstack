import express from 'express';
import {
    getItems,
    postSelect,
    postSort,
} from '../controllers/itemsController.js';

const router = express.Router();

router.get('/items', getItems);
router.post('/select', postSelect);
router.post('/sort', postSort);

export default router;