import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Path utility to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Serve static files from the "public" directory
app.use(express.static('public'));

// Send the main HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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