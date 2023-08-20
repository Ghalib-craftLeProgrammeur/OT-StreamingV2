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
    const animeIndex = data.animeList.findIndex(anime => anime.title === animeTitle);

    if (animeIndex !== -1) {
        // Initialize episodes as an empty array if not already defined
        data.animeList[animeIndex].episodes = data.animeList[animeIndex].episodes || [];

        const episodeIndex = data.animeList[animeIndex].episodes.findIndex(episode => episode.episodeNumber === episodeNumber);
        
        if (episodeIndex !== -1) {
            data.animeList[animeIndex].episodes.splice(episodeIndex, 1);
            fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
            res.json({ message: 'Episode deleted successfully' });
        } else {
            res.status(404).json({ error: 'Episode not found' });
        }
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});



app.post('/addEpisode', (req, res) => {
    const newEpisode = req.body;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Find the index of the anime with the specified title
    const animeIndex = data.animeList.findIndex(anime => anime.title === newEpisode.anime);

    if (animeIndex !== -1) {
        // Initialize episodes as an empty array if not already defined
        data.animeList[animeIndex].episodes = data.animeList[animeIndex].episodes || [];

        // Push the new episode to the 'episodes' array of the anime
        data.animeList[animeIndex].episodes.push(newEpisode);

        // Write the updated data back to the 'data.json' file
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');

        res.json({ message: 'Episode added successfully' });
    } else {
        // Return an error response if the anime is not found
        res.status(404).json({ error: 'Anime not found' });
    }
});


app.post('/addFeaturedAnime', (req, res) => {
    const newFeaturedAnime = req.body;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Initialize featuredAnime array if not already defined
    data.featuredAnime = data.featuredAnime || [];

    // Add the new featured anime to the list
    data.featuredAnime.push(newFeaturedAnime);

    // Write the updated data to the data.json file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
    res.json({ message: 'Featured anime added successfully' });
});
// Route to get anime details
app.get('/getAnimeDetails', (req, res) => {
    const animeName = req.query.name;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const animeDetails = {
        featuredAnime: data.featuredAnime,
        animeList: data.animeList.find(anime => anime.title === animeName)
    };

    if (animeDetails.animeList) {
        res.json(animeDetails);
    } else {
        res.status(404).json({ error: 'Anime not found' });
    }
});



// Route to get the list of featured anime
app.get('/getFeaturedAnime', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.json(data.featuredAnime);
});
const defaultData = {
    animeList: [],
    featuredAnime: []
};
const dataPath = path.join(__dirname, 'data.json');
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), 'utf8');
}
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
app.post('/addAnime', (req, res) => {
    const newAnime = req.body;
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Check if the anime already exists
    const existingAnimeIndex = data.animeList.findIndex(anime => anime.title === newAnime.title);

    if (existingAnimeIndex !== -1) {
        res.status(400).json({ error: 'Anime already exists' });
        return;
    }

    // Create a new anime object
    const animeObject = {
        title: newAnime.title,
        totalEpisodes: newAnime.totalEpisodes,
        episodes: [] // Initialize episodes as an empty array
    };

    // Add the new anime object to the animeList array
    data.animeList.push(animeObject);

    // Write the updated data to the data.json file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
    res.json({ message: 'New anime added successfully' });
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
