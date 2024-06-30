import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index.ejs", {
        song: songData,
    });
});

app.get('/api/songs', (req, res) => {
    res.json(songData);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const songData = [
    {id: 1, name: "Magnetic", artist: "ILLIT", },
    {id: 2, name: "Simp Gái 808", artist: "Low G"},
];