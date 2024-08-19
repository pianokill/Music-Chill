import authRouter from './routers/authRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import songRouter from './routers/songRouter.js';
import historyRouter from './routers/historyRouter.js';
import profileRouter from './routers/profileRouter.js';
import playlistRouter from './routers/playlistRouter.js';
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

app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    res.status(403).send('Access Denied');
  } else {
    next();
  }
});

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

// Use the auth router
const upload = multer();
app.use('/auth', upload.none());
app.use("/auth", authRouter);

// Use the upload router
app.use("/upload", uploadRouter);

// Use the profile router
app.use("/profile", profileRouter);

// API route to get song data
app.use('/api/songs', songRouter);

// API route to get history data
app.use('/api/history', historyRouter);
// API route to get playlist data
app.use('/api/playlists', playlistRouter);


// Send the main HTML file on the root route
app.get('/', (req, res) => {
    if (req.isAuthenticated("local-login")) {
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } else {
        res.redirect('/auth');
    }
});

export default app;
