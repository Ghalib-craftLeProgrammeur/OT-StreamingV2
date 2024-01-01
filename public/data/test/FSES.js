document.addEventListener("DOMContentLoaded", () => {

let Name;
const Featureds = document.getElementById('addFeaturedAnime');
const deleteEpisodeForm = document.getElementById('delete-episode-form');
Featureds.addEventListener('click', () => {
    toggleFormVisibility('add-featured-anime-form');
});

document.getElementById('deleteEpisodeButton').addEventListener('click', () => {
    toggleFormVisibility('delete-episode-form');
});

document.getElementById('add-featured-anime-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const featuredAnimeName = document.getElementById('featuredAnimeName').value;
    const featuredAnimeThumbnail = document.getElementById('featuredAnimeThumbnail').value;
    const featuredAnimeData = {
        name: featuredAnimeName,
        thumbnail: featuredAnimeThumbnail
    };
    try {
        const response = await fetch('/api/addFeaturedAnime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(featuredAnimeData)
        });
        if (response.ok) {
            alert('Featured anime added successfully!');
            loadFeaturedAnime(); // Refresh the featured anime thumbnails
        } else {
            alert('Error adding featured anime');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
async function displayEpisodes(animeName) {
    const response = await fetch(`/api/getAnimeDetails?name=${animeName}`);
    const data = await response.json();
    console.log({ data });

    if (data.totalEpisodes) {
        Name = animeName;
        const clear = document.getElementById("grid-container");
        clear.innerHTML = '<div id="episode-container" class="episode-container"><!-- Episode squares will be added here --></div><div id="episode-popup" class="episode-popup" style="display: none;"> <!-- Popup content goes here --></div>'
        const totalEpisodes = data.totalEpisodes;
        const searchBar = document.createElement("input");
        searchBar.type = "text";
    
        const episodeContainer = document.getElementById('episode-container');

        // Clear existing content in the episodeContainer
        episodeContainer.innerHTML = '';
        searchBar.addEventListener('keydown', async (key) => {
        if(key.code === "Enter") {
            const response = await fetch(`/api/getEpisodeDetails?episode=${searchBar.value}&animeName=${animeName}`);
            const data = await response.json();
            displayEpisodePopup(data, searchBar.value);
        }
        })
        // Loop through episodes and create squares
        for (let episodeNumber = 1; episodeNumber <= totalEpisodes; episodeNumber++) {
            const square = document.createElement('div');
            square.classList.add('episode-square');
            square.innerText = episodeNumber;
            // Add a click event listener to open the popup
            square.addEventListener('click', async () => {
                const response = await fetch(`/api/getEpisodeDetails?episode=${episodeNumber}&animeName=${animeName}`);
                const data = await response.json();
                displayEpisodePopup(data, episodeNumber);
                console.log(episodeNumber);
            });

            episodeContainer.appendChild(square);
            episodeContainer.appendChild(searchBar);
        }
    }
}


// ... Previous code ...

// Function to display the episode popup
function displayEpisodePopup(episode, currentEpisode) {
    const episodePopup = document.getElementById('episode-popup');
    let embedCode = "";
    if(episode.embedCode != null ) {
        embedCode = episode.embedCode;
      } 
    

    // Customize the popup content to display episode details and embed code editing
    episodePopup.innerHTML = `
        <div id="closePopup" class="close-popup">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="16" y2="16" stroke="black" stroke-width="2" />
                <line x1="0" y1="16" x2="16" y2="0" stroke="black" stroke-width="2" />
            </svg>
        </div>
        <h2>Episode ${currentEpisode}</h2>
        <p>Embed Code:</p>
        <textarea id="embedCodeInput" class="embedCodeInput">${embedCode}</textarea>
        <button id="addEmbedButton">Add Embed</button>
    `;

    // Add an event listener to close the popup
    const closePopup = document.getElementById('closePopup');
    closePopup.addEventListener('click', () => {
        episodePopup.style.display = 'none';
    });
    episodePopup.style.display = 'block';

    const addEmbedButton = document.getElementById('addEmbedButton');
    addEmbedButton.addEventListener('click', async () => {
        const embedCode = document.getElementById('embedCodeInput').value;
        const episodeNumber = parseInt(document.querySelector('#episode-popup h2').textContent.match(/\d+/)); // Extract episode number from the popup title
        const nextEpisodeNumber = episodeNumber + 1;
      
        // Create the episode data object
        const episodeData = {
            anime: Name,
            episodeNumber: episodeNumber,
            embedCode: embedCode,
            nextEpisodeNumber: nextEpisodeNumber
        };
        let existingEpisode = false;
        if(episode.embedCode = null) {
            existingEpisode = false;
        } else {
           existingEpisode = true; 
        }
        if (existingEpisode) {
            // Send a DELETE request to remove the existing episode
            const deleteEpisodeData = {
                anime: Name,
                episodeNumber: episodeNumber
            };
            fetch('/api/deleteEpisode', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deleteEpisodeData),
            })
            .then(deleteResponse => {
                if (deleteResponse.ok) {
                    console.log('Existing episode deleted successfully.');
                } else {
                    console.error('Error deleting existing episode.');
                }
                
                // Now, proceed to add the new episode
                addOrUpdateEpisode(episodeData);
            })
            .catch(error => {
                console.error('Error deleting existing episode:', error);
            });
        } else {
            // If no existing episode, simply add the new episode
            addOrUpdateEpisode(episodeData);
        }
        
        // Close the popup
        episodePopup.style.display = 'none';
    });
}

function addOrUpdateEpisode(episodeData) {
    // Send a POST request to add or update the episode
    fetch('/api/addEpisode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(episodeData),
    })
    .then(response => {
        if (response.ok) {
            console.log('Episode added or updated successfully!');
            alert('Episode added or updated successfully!');
        } else {
            console.error('Error adding or updating embed code');
            alert('Error adding or updating embed code');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred');
    });
}

// ... Remaining code ...


// Event listener for "Add Episode" button
const addEpisodeButton = document.getElementById('addepisodebtn');
addEpisodeButton.addEventListener('click', () => {
    const episodeForm = document.getElementById('episode-form');
    episodeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const animeName = document.getElementById('anime').value; // Get the anime title
        episodeForm.style.display = 'none'; // Hide the form
        displayEpisodes(animeName); // Display episode squares
    });
});

// Event listener for episode form submission
const episodeForm = document.getElementById('episode-form');
episodeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const animeName = document.getElementById('anime').value;
    episodeForm.style.display = 'none'; // Hide the form
    displayEpisodes(animeName); // Display episode squares
});

deleteEpisodeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deleteAnime = document.getElementById('deleteAnime').value;
    const deleteEpisodeNumber = document.getElementById('deleteEpisodeNumber').value;

    // Validate input
    if (!deleteAnime || !deleteEpisodeNumber) {
        alert('Please provide both anime title and episode number.');
        return;
    }

    // Prepare data
    const deleteEpisodeData = {
        anime: deleteAnime,
        episodeNumber: deleteEpisodeNumber
    };

    // Show loading spinner or disable the form
    // Example: showLoadingSpinner();

    try {
        // Make DELETE request
        const response = await fetch('/api/deleteEpisode', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteEpisodeData)
        });

        if (response.ok) {
            alert('Episode deleted successfully!');
            deleteEpisodeForm.reset();
        } else {
            // Handle error response
            const errorMessage = await response.text();
            console.error('Error deleting episode:', errorMessage);
            alert('Error deleting episode: ' + errorMessage);
        }
    } catch (error) {
        // Handle network or unexpected errors
        console.error('Error:', error);
        alert('An error occurred');
    } finally {
        // Hide loading spinner or re-enable the form
        // Example: hideLoadingSpinner();
        
    }
});

addEpisodeButton.addEventListener('click', () => {
    toggleFormVisibility('episode-form');
});

document.getElementById('episode-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const anime = document.getElementById('anime').value;
    const episodeNumber = document.getElementById('episodeNumber').value;
    const embedCode = document.getElementById('embedCode').value;
    const nextEpisode = document.getElementById('nextEpisode').value;
    const episodeData = {
        anime,
        episodeNumber: parseInt(episodeNumber),
        embedCode,
        nextEpisode: parseInt(nextEpisode)
    };
    try {
        const response = await fetch('/api/addEpisode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(episodeData)
        });
        if (response.ok) {
            alert('Episode added successfully!');
            document.getElementById('episode-form').reset();
        } else {
            alert('Error adding episode');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});

const addAnimeForm = document.getElementById('addAnimeForm');
addAnimeButton.addEventListener('click', () => {
    toggleFormVisibility('addAnimeForm');
});
addAnimeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Show the spinner when the form is submitted
    const spinner = document.getElementById('loading-screen');
    spinner.style.display = 'block';

    const newAnimeName = document.getElementById('newAnimeName').value;
    const totalEpisodes = document.getElementById('totalEpisodes').value;
    const newAnimeData = {
        title: newAnimeName,
        totalEpisodes: parseInt(totalEpisodes)
    };

    try {
        const response = await fetch('/api/addAnime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAnimeData)
        });

        if (response.ok) {
            alert('New anime added successfully!');
            addAnimeForm.reset();
        } else {
            alert('Error adding new anime');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    } finally {
        // Hide the spinner after the operation is complete (whether successful or not)
        spinner.style.display = 'none';
    }
});


function toggleFormVisibility(formId) {
    const form = document.getElementById(formId);
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
}
});