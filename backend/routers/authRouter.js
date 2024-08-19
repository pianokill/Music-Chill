import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';
import forgetRouter from './forgetRouter.js'


const router = express.Router();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    if (req.isAuthenticated("local-login")) {
        res.redirect('/');
    } else {
        // console.log(req.session);
        res.sendFile(path.join(__dirname, '../public', 'login.html'));
    }
});


router.post("/signin", userController.signIn);

router.post("/signup", userController.signUp);

router.get("/logout", userController.logout);

//forget passsword
router.use("/forgetPassword", forgetRouter);

export default router;