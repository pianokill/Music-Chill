import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';
import OTP from '../utils/otp.js'

const router = express.Router();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Send the upload HTML file on the /upload route
router.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../public', 'forget_password.html'));
});

router.post("/", userController.checkEmail);

router.get("/otp", async (req, res) => {
   const check = await userController.verifyOTP(req, res);
   console.log(check);
   if (check) res.sendFile(path.join(__dirname, '../public', 'change_password.html'));
   else {
      res.clearCookie("token");;
      res.redirect("/");}
});

router.post("/otp", userController.checkOTP);

export default router;