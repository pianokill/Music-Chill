import loginRouter from './routers/loginRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import songRouter from './routers/songRouter.js';
import historyRouter from './routers/historyRouter.js';
import passport from "./utils/passport.js";
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files from the "public" directory
app.use(express.static('public'));

// Parse incoming JSON data
app.use(express.json());

// Parse incoming URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Initialize session
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
      },
    })
  );
  
//khoi tao passport
app.use(passport.initialize());
app.use(passport.session());

// Use the login router
const upload = multer();
app.use('/login', upload.none());
app.use("/login", loginRouter);

// Use the upload router
app.use("/upload", uploadRouter);

// Send the main HTML file on the root route
app.get('/', (req, res) => {
    if (req.isAuthenticated("local-login")) {
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } else {
        res.redirect('/login');
    }
});


// API route to get song data
app.use('/api/songs', songRouter);
app.use('/api/history', historyRouter)
export default app;
