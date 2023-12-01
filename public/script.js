

// Category Popup
const categoryLink = document.getElementById('category-link');
const categoryPopup = document.getElementById('category-popup');
const closePopup = document.getElementById('close-popup');
const LogoHome = document.getElementById("LogoHome");



LogoHome.addEventListener('click', () => {
document.location.href = "/"
})
categoryLink.addEventListener('click', openCategoryPopup);

function openCategoryPopup() {
   document.getElementById("category-popup").style.display = "block";
}

closePopup.addEventListener('click', closeCategoryPopup);

function closeCategoryPopup() {
    categoryPopup.style.display = 'none';
}

// Modal
const modal = document.querySelector('.modal');
const modalBtn = document.querySelector('.show-modal');
const closeBtn = document.querySelector('.close-btn');


function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

function outsideClick(e) {
    if (e.target === modal) {
        closeModal();
    }
}
    // Function to fetch and display featured anime thumbnails
    function loadFeaturedAnime() {
        const thumbnailContainer = document.getElementById('thumbnail-container');
        // Fetch the list of featured anime from the server
        fetch('/api/getFeaturedAnime')
            .then(response => response.json())
            .then(featuredAnimeList => {
                thumbnailContainer.innerHTML = '';
                // Generate thumbnail elements for each featured anime
                featuredAnimeList.forEach(featuredAnime => {
                    const thumbnail = document.createElement('a');
                    thumbnail.href = `anime.html?name=${featuredAnime.name}`;
                    thumbnail.innerHTML = `<img src="${featuredAnime.thumbnail}" width="140" alt="${featuredAnime.name}">`;
                    thumbnailContainer.appendChild(thumbnail);
                });
            })
            .catch(error => {
                console.error('Error fetching featured anime:', error);
            });
    }
    function searchAnime() {
        const input = document.getElementById("search-input");
        const filter = input.value.trim();
        const ul = document.getElementById("myUL");
        const maxResults = 4;
    
        if (filter === '') {
            ul.innerHTML = '';
        } else {
            fetch(`/api/searchAnime?query=${filter}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch anime list');
                    }
                    return response.json();
                })
                .then(animeList => {
                    ul.innerHTML = '';
                    animeList.slice(0, maxResults).forEach(animeId => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = `anime.html?name=${animeId}`;
                        a.textContent = animeId;
    
                        li.appendChild(a);
                        ul.appendChild(li);
                    });
                })
                .catch(error => {
                    console.error('Error fetching anime list:', error);
                    ul.innerHTML = '<li>Error fetching anime list. Please try again later.</li>';
                });
        }
    }
    


// Add an event listener to the search input to trigger the search
document.getElementById("search-input").addEventListener("input", searchAnime);

    // Call the loadFeaturedAnime function when the page loads
    window.onload = loadFeaturedAnime;