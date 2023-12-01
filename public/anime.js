// Function to parse query parameters from URL
function getQueryParam(name) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(name);
}

// Function to fetch and display anime details based on query parameter
async function loadAnimeDetails() {
    const animeName = getQueryParam("name");
    const response = await fetch(`/api/getAnimeDetails?name=${animeName}`);
    const AnimeDetails = await response.json();
    let currentEpisodeIndex = 1;
    const responses = await fetch(`/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`);
    const data = await responses.json();

    function OnEpisodeChanged(EpisodeNumber) {
        if(EpisodeNumber <= 1) {
           PreviousEpisode.disabled = true; // Disable the "Next Episode" button when at the last episode
         } else {
           PreviousEpisode.disabled = false;
         }
         
         if(EpisodeNumber >= AnimeDetails.totalEpisodes) {
           NextEpisode.disabled = true;
         } else {
           NextEpisode.disabled = false;
         }
   }
    const AnimeDiv = document.getElementById("anime-info");
    const AnimeTitle = document.createElement("h1");
    AnimeTitle.textContent = animeName;
    const Episodes = document.createElement("p");
    Episodes.textContent = currentEpisodeIndex + " EP / " + AnimeDetails.totalEpisodes + " EP";
    Episodes.className = "EpisodeNumber"
    const VideoEmbed = document.createElement("div");
    let embedCode;
    if(data.embedCode == null) {
      embedCode = "<h2>Episode is not availble</h2>"
    
    } else {
      embedCode = data.embedCode;
    }
    VideoEmbed.innerHTML = `${embedCode}`;

    const PreviousEpisode = document.createElement("button");
    PreviousEpisode.textContent = "Previous Episode";
    PreviousEpisode.addEventListener("click", async () => {
        if (currentEpisodeIndex != 1) {
            currentEpisodeIndex -= 1;
            const responses = await fetch(`/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`);
        const datsa = await responses.json();
        let embedCode;
        if(data.embedCode == null) {
          embedCode = "<h2>Episode is not availble</h2>"
        
        } else {
          embedCode = data.embedCode;
        }
        VideoEmbed.innerHTML = `${embedCode}`
        Episodes.textContent = currentEpisodeIndex + " EP / " + AnimeDetails.totalEpisodes + " EP";
  
        } else if (currentEpisodeIndex === 1) {
            PreviousEpisode.disabled = true;
        }
        
        OnEpisodeChanged(currentEpisodeIndex);
    })
    const NextEpisode = document.createElement("button");
    NextEpisode.textContent = "Next Episode";

    
    NextEpisode.addEventListener("click", async () => {
      if (currentEpisodeIndex < AnimeDetails.totalEpisodes) {
        currentEpisodeIndex += 1;
         const responses = await fetch(`/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`);
        const datsa = await responses.json();
        let embedCode;
        if(data.embedCode == null) {
          embedCode = "<h2>Episode is not availble</h2>"
        
        } else {
          embedCode = data.embedCode;
        }
        VideoEmbed.innerHTML = `${embedCode}`
        Episodes.textContent = currentEpisodeIndex + " EP / " + AnimeDetails.totalEpisodes + " EP";
        OnEpisodeChanged(currentEpisodeIndex);
    } 
    });
  
    AnimeDiv.appendChild(AnimeTitle);
    AnimeDiv.appendChild(Episodes);
    AnimeDiv.appendChild(VideoEmbed);
    
    AnimeDiv.appendChild(PreviousEpisode);
    AnimeDiv.appendChild(NextEpisode);
    

    OnEpisodeChanged(currentEpisodeIndex);
// Fetch anime description from AniList API and display it on the screen
    const animeDescriptionPromise =
      fetchAnimeDescriptionFromAniList(animeName);
    animeDescriptionPromise.then((animeDescription) => {
      const cleanedDescription = animeDescription.replace(/<br\s*\/?>/g, "");

      fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: cleanedDescription }),
      })
        .then((response) => response.json())
        .then((translationResult) => {
          const translatedDescriptionElement = document.createElement("div");
          translatedDescriptionElement.textContent =
            translationResult.message;
          translatedDescriptionElement.classList.add(
            "translated-description"
          );
          AnimeDiv.appendChild(translatedDescriptionElement);
        })
        .catch((error) => {
          console.error("Error translating description:", error);
        });
    });
  

const animeDescription = "OT-Streaming VF";

// ... (rest of your code)

// Update the title with the anime name and description
document.title = `${animeName} - ${animeDescription}`;
const Infos = document.getElementById("anime-infos");
 };
// Function to fetch and display episode details

  
  // Fetch anime description from AniList API

// Function to fetch anime details from AniAPI
// Function to fetch anime description from AniList API
// Function to fetch anime description from AniList API
async function fetchAnimeDescriptionFromAniList(animeName) {
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                query ($search: String) {
                    Media(search: $search, type: ANIME) {
                        description
                    }
                }
            `,
        variables: {
          search: animeName,
        },
      }),
    });

    const data = await response.json();

    return data.data.Media.description || "Pas de description disponible";
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la description de l'anime :",
      error
    );
    return "Pas de description disponible";
  }
}
// Fetch anime description from AniList API and display it on the screen

// Call the loadAnimeDetails function when the page loads
window.onload = loadAnimeDetails;
