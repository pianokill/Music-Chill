import express from 'express';
import playlistController from '../controllers/playlistController.js';

const router = express.Router();

// API route to handle playlist requests
router.post('/create', (req, res) => {playlistController.createPlaylist(req, res)});
router.get('/user', (req, res) => {playlistController.getUserPlaylist(req, res)});
router.post('/addSong', (req, res) => {playlistController.addSongToPlaylist(req, res)});
router.get('/:playlistId', (req, res) => {playlistController.getPlaylistSongs(req, res)});

export default router;