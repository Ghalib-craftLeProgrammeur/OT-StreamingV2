const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); // Import the 'path' module
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (including data.json)
app.use(express.static(path.join(__dirname, 'public')));

// Route to get anime dvetails
app.delete('/deleteEpisode', (req, res) => {
    const animeTitle = req.body.anime;
    const episodeNumber = parseInt(req.body.episodeNumber);

    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const animeIndex = data.findIndex(anime => anime.title === animeTitle);

    if (animeIndex !== -1) {
        const episodeIndex = data[animeIndex].episodes.findIndex(episode => episode.episodeNumber === episodeNumber);
        
        if (episodeIndex !== -1) {
            data[animeIndex].episodes.splice(episodeIndex, 1);
            fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
            res.json({ message: 'Episode deleted successfully' });
        } else {
            res.status(404).json({ error: 'Episode not found' });
        }
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
// Route to delete an episode
app.delete('/deleteEpisode', (req, res) => {
    const animeTitle = req.body.anime;
    const episodeNumber = parseInt(req.body.episodeNumber);

    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const animeIndex = data.findIndex(anime => anime.title === animeTitle);

    if (animeIndex !== -1) {
        const episodeIndex = data[animeIndex].episodes.findIndex(episode => episode.episodeNumber === episodeNumber);
        if (episodeIndex !== -1) {
            data[animeIndex].episodes.splice(episodeIndex, 1);
            fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
            res.json({ message: 'Episode deleted successfully' });
        } else {
            res.status(404).json({ error: 'Episode not found' });
        }
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});

// Route to add a new anime
app.post('/addAnime', (req, res) => {
    const newAnime = req.body;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Check if the anime already exists
    const existingAnime = data.find(anime => anime.title === newAnime.title);
    if (existingAnime) {
        res.status(400).json({ error: 'Anime already exists' });
        return;
    }

    // Create a new anime object
    const animeObject = {
        title: newAnime.title,
        totalEpisodes: newAnime.totalEpisodes,
        // Add more properties as needed for the new anime
        episodes: [] // Initialize episodes as an empty array
    };

    // Add the new anime object to the data array
    data.push(animeObject);

    // Write the updated data to the data.json file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
    res.json({ message: 'New anime added successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
