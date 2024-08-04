import userModel from "../models/userModel.js";
import passport from "../utils/passport.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

class userController {
  signIn = passport.authenticate("local", {
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
      
      const newUser = await userModel.createUser(username, hash, email, isArtist);
      console.log(newUser);
      res.json({ message: "Sign up success", error: false});
    } catch (error) {
      console.log(error);
      if (error.constraint === "users_name_key") {
        res.json({ message: "Username already exists", error: true});
      } else if (error.constraint === "users_email_key") {
        res.json({ message: "Email already exists", error: true});
      }
    }
  };

}

export default new userController();
