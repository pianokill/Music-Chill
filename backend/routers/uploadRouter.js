import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import songController from '../controllers/songController.js';
import multer from 'multer';


const router = express.Router();
const upload = multer();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Send the upload HTML file on the /upload route
router.get('/', (req, res) => {
    if (req.isAuthenticated() && req.user.is_artist === true) {
        res.sendFile(path.join(__dirname, '../public', 'upload.html'));
    }
    else {
        res.redirect('/');
    }
});

// API route to handle file uploads
const fields = [
    { name: "songFile", maxCount: 1 },
    { name: "imgFile", maxCount: 1 },
];
router.post('/', upload.fields(fields), (req, res) => {songController.createSong(req, res)});

export default router;