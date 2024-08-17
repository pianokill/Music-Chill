import express from 'express';
import historyController from '../controllers/historyController.js';

const router = express.Router();

// API route to handle song requests
router.get('/historysongsartist', (req, res) => {historyController.getHistory(req, res)});
router.get('/likedSongs', (req, res) => {historyController.getLikedSongs(req, res)});
router.put('/likeSong/:id', (req, res) => {historyController.updateLikeSong(req, res)});
router.put('/listeningTimes/:id', (req, res) => {historyController.updateListeningTimes(req, res)});

export default router;