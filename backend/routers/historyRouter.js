import express from 'express';
import historyController from '../controllers/historyController.js';

const router = express.Router();

// API route to handle song requests
router.get('/historysongsartist', (req, res) => {historyController.getHistory(req, res)});

export default router;