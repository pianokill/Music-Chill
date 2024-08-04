import express from 'express';
import songController from '../controllers/songController.js';

const router = express.Router();

// API route to handle song requests
router.get('/usersongs', (req, res) => {songController.getSongs(req, res)});

export default router;