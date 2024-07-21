import loginRouter from './routers/loginRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { fileURLToPath } from 'url';
import multer from 'multer';

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
      secret: 'HHSKK',
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
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
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } else {
        res.redirect('/login');
    }
});

// API route to get song data
app.get('/api/songs', (req, res) => {
    res.json(songData);
});

const songData = [
    {id: 1, name: "Magnetic", artist: "ILLIT", },
    {id: 2, name: "Simp Gái 808", artist: "Low G"},
    {id: 3, name: "Đừng làm trái tim anh đau", artist: "Sơn Tùng M-TP"},
    {id: 4, name: "Mascara", artist: "Chillies"},
    {id: 5, name: "Đâu Ai Dám Hứa", artist: "Czee"},
];

export default app;
