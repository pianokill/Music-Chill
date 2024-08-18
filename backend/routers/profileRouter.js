import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import songController from '../controllers/songController.js';

const router = express.Router();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//truy cap proflie page
router.get('/', (req, res) => {
    if (req.isAuthenticated("local-login")){
        const user = {
            name: req.user.name,
            check: req.user.is_artist,
            mail: req.user.email
          };
        res.cookie('user', JSON.stringify(user), { maxAge: 900000, httpOnly: false });
        res.sendFile(path.join(__dirname, '../public', 'profile_page.html'));
    } else {
        // console.log(req.session);
        res.redirect('/');
    }
  });

//láy dữ liệu
router.get('/api', async (req, res) =>{
  const songData = await songController.getSongByID(req);
  res.json(songData);
})

router.get('/update', async (req, res) => {
    if (req.isAuthenticated("local-login")){
        res.sendFile(path.join(__dirname, '../public', 'update.html'));
    } else {
        // console.log(req.session);
        res.redirect('/');
    }
  });

  
router.post('/update', songController.updateSongData);

export default router;