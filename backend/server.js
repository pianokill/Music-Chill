import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();
const port = 3000;

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup multer for file upload handling
const upload = multer();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Send the main HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Send the upload HTML file on the /upload route
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// API route to handle file uploads
const fields = [
    { name: "songFile", maxCount: 1 },
    { name: "imgFile", maxCount: 1 },
];
app.post('/uploads', upload.fields(fields), (req, res) => {
    console.log(req.files);
    console.log(req.body);
    res.json({ message: "Files uploaded successfully!" });
});

// API route to get song data
app.get('/api/songs', (req, res) => {
    res.json(songData);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const songData = [
    {id: 1, name: "Magnetic", artist: "ILLIT", },
    {id: 2, name: "Simp Gái 808", artist: "Low G"},
    {id: 3, name: "Đừng làm trái tim anh đau", artist: "Sơn Tùng M-TP"},
    {id: 4, name: "Mascara", artist: "Chillies"},
    {id: 5, name: "Đâu Ai Dám Hứa", artist: "Czee"},
];