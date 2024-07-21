import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userHandler from '../controllers/userController.js';

const router = express.Router();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        // console.log(req.session);
        res.sendFile(path.join(__dirname, '../public', 'login.html'));
    }
});

router.post("/signin", userHandler.signIn);

router.post("/signup", userHandler.signUp);

export default router;