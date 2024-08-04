import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

//tao ss
passport.serializeUser((user, done) => done(null, user.id));

// gan ss
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});


//xac thuc dang nhap
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
          return done(null, false);
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

export default passport;
