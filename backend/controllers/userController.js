import userModel from "../models/userModel.js";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTP from "../utils/otp.js";
import env from "dotenv";
env.config();

const saltRounds = 10;

const otpStore = {};

class userController {
  signIn = passport.authenticate("local-login", {
    failureRedirect: "/login",
    successRedirect: "/",
  });

  signUp = async (req, res, next) => {
    console.log(req.body);
    let { username, email, isArtist } = req.body;
    if (isArtist) {
      isArtist = true;
    } else {
      isArtist = false;
    }
    try {
      const hash = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = await userModel.createUser(
        username,
        hash,
        email,
        isArtist
      );
      console.log(newUser);
      res.json({ message: "Sign up success", error: false });
    } catch (error) {
      console.log(error);
      if (error.constraint === "users_name_key") {
        res.json({ message: "Username already exists", error: true });
      } else if (error.constraint === "users_email_key") {
        res.json({ message: "Email already exists", error: true });
      }
    }
  };

  logout = async (req, res, next) => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  };

  checkEmail = async (req, res) => {
    const email = req.body.email;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      res.clearCookie("token");
      return res.json({ message: "Email is not exists!", error: true });
    }
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    res.cookie("token", token, { httpOnly: true, secure: false });
    return res.json({ message: "Valid email!", error: false });
  };

  verifyOTP = async (req, res) => {
    const token = req.headers.cookie.split("token=")[1];
    if (!token) {
      return false;
    }
    try {
      // Xác minh JWT
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decoded.email);
      const email = decoded.email;
      const otp = OTP.generateOTP();
      await OTP.sendOTP(email, otp);
      otpStore[email] = {
        otp: otp,
        expiry: Date.now() + 10 * 60 * 1000, // Thời gian hết hạn sau 10 phút
      };
      console.log(otp);
      return true;
    } catch (error) {
      res.clearCookie("token");
      return false;
    }
  };

  checkOTP = (req, res) => {
    const token = req.headers.cookie.split("token=")[1];
    console.log("checkOTP")
    if (!token) {
      return res.json({ message: "Token is not exists!", error: true });
    } else
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;
        const otpData = otpStore[email];
        //get from body
        const otp = req.body.OTP;
        const password = req.body.password;
        if (otpData) {
          if (otpData.otp === otp && Date.now() < otpData.expiry) {
            // Xóa OTP sau khi xác thực thành công
            console.log("changepassword");
            //thay pass ở đây
            delete otpStore[email];
            res.clearCookie("token");
            return res.json({
              message: "Password change successful, please log in again!",
              error: false,
            });
          } else {
            return res.json({ message: "OTP is incorrect, please check your mail and try again!", error: true });
          }
        }
      } catch (err) {
        return res.json({ message: err, error: true });
      }
  };
}

export default new userController();
