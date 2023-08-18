const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); // Import the 'path' module
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (including data.json)
app.use(express.static(__dirname));

// Route to get anime details
app.get('/getAnimeDetails', (req, res) => {
    const animeName = req.query.name;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const animeDetails = data.find(anime => anime.title === animeName);
    if (animeDetails) {
        res.json(animeDetails);
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});

// Route to add an episode
app.post('/addEpisode', (req, res) => {
    const newEpisode = req.body;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const animeIndex = data.findIndex(anime => anime.title === newEpisode.anime);
    if (animeIndex !== -1) {
        data[animeIndex].episodes.push(newEpisode);
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
        res.json({ message: 'Episode added successfully' });
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});

// Route handler for the root URL
app.get('/', (req, res) => {
    // Use 'path' to send the index.html file
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
