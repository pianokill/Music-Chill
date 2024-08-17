import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//truy cap proflie page
router.get('/', (req, res) => {
    if (req.isAuthenticated("local-login")){
        res.sendFile(path.join(__dirname, '../public', 'profile_page.html'));
    } else {
        // console.log(req.session);
        res.redirect('/');
    }
  });
router.get('/statistics', (req, res) => {
    if (req.isAuthenticated("local-login")){
        res.sendFile(path.join(__dirname, '../public', 'profile_statistics.html'));
    } else {
        // console.log(req.session);
        res.redirect('/');
    }
  });

export default router;