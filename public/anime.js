// Function to parse query parameters from URL
function getQueryParam(name) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(name);
}

// Function to fetch and display anime details based on query parameter
async function loadAnimeDetails() {
  const animeName = getQueryParam("name");
  const episodeNumber = getQueryParam("episode");

  const response = await fetch(`/api/getAnimeDetails?name=${animeName}`);
  const AnimeDetails = await response.json();
  let currentEpisodeIndex = 1;
  let responses;

  if (episodeNumber) {
    currentEpisodeIndex = parseInt(episodeNumber); // Parse episode number to integer
    responses = await fetch(
      `/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`
    );
  } else if(localStorage.getItem(`${animeName}_lastVisitedEpisode`) && !episodeNumber) {
    responses = await fetch(
      `/api/getEpisodeDetails?animeName=${animeName}&episode=${localStorage.getItem(`${animeName}_lastVisitedEpisode`)}`
    );
     
  } else {
    responses = await fetch(
      `/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`
    );
  }
  const data = await responses.json();

  function onEpisodeChanged(episodeNumber) {
    if (episodeNumber <= 1) {
      PreviousEpisode.disabled = true; // Disable the "Next Episode" button when at the last episode
    } else {
      PreviousEpisode.disabled = false;
    }

    if (episodeNumber >= AnimeDetails.totalEpisodes) {
      NextEpisode.disabled = true;
    } else {
      NextEpisode.disabled = false;
    }

    // Store the current episode index in local storage
    localStorage.setItem(`${animeName}_lastVisitedEpisode`, episodeNumber);
  }

  const AnimeDiv = document.getElementById("anime-info");
  const AnimeTitle = document.createElement("h1");
  AnimeTitle.textContent = animeName;
  const Episodes = document.createElement("p");
  Episodes.textContent =
    currentEpisodeIndex + " EP / " + AnimeDetails.totalEpisodes + " EP";
  Episodes.className = "EpisodeNumber";
  const VideoEmbed = document.createElement("div");
  let embedCode;
  if (data.embedCode == null) {
    embedCode = "<h2>Episode is not available</h2>";
  } else {
    embedCode = data.embedCode;
  }
  VideoEmbed.innerHTML = `${embedCode}`;

  const PreviousEpisode = document.createElement("button");
  PreviousEpisode.textContent = "Previous Episode";
  PreviousEpisode.id = "Prvsbtn";
  PreviousEpisode.addEventListener("click", async () => {
    if (currentEpisodeIndex != 1) {
      currentEpisodeIndex -= 1;
      const responses = await fetch(
        `/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`
      );
      const datsa = await responses.json();
      let embedCode;
      if (data.embedCode == null) {
        embedCode = "<h2>Episode is not available</h2>";
      } else {
        embedCode = data.embedCode;
      }
      VideoEmbed.innerHTML = `${embedCode}`;
      Episodes.textContent =
        currentEpisodeIndex + " EP / " + AnimeDetails.totalEpisodes + " EP";
    } else if (currentEpisodeIndex === 1) {
      PreviousEpisode.disabled = true;
    }

 // Update the URL with the new episode number
 const newUrl = `anime.html?name=${animeName}&episode=${currentEpisodeIndex}`;
 history.pushState({}, '', newUrl);
 location.reload();
    onEpisodeChanged(currentEpisodeIndex);
  });
  const NextEpisode = document.createElement("button");
  NextEpisode.textContent = "Next Episode";
  NextEpisode.id = "NxtBTN";

  NextEpisode.addEventListener("click", async () => {
    if (currentEpisodeIndex < AnimeDetails.totalEpisodes) {
      currentEpisodeIndex += 1;
      const responses = await fetch(
        `/api/getEpisodeDetails?animeName=${animeName}&episode=${currentEpisodeIndex}`
      );
      const datsa = await responses.json();
      let embedCode;
      if (data.embedCode == null) {
        embedCode = "<h2>Episode is not available</h2>";
      } else {
        embedCode = data.embedCode;
      }
      VideoEmbed.innerHTML = `${embedCode}`;
      Episodes.textContent =
        currentEpisodeIndex + " EP / " + AnimeDetails.totalEpisodes + " EP";
         // Update the URL with the new episode number
  const newUrl = `anime.html?name=${animeName}&episode=${currentEpisodeIndex}`;
  history.pushState({}, '', newUrl);
  location.reload();
      onEpisodeChanged(currentEpisodeIndex);
    }
  });

  AnimeDiv.appendChild(AnimeTitle);
  AnimeDiv.appendChild(Episodes);
  AnimeDiv.appendChild(VideoEmbed);

  AnimeDiv.appendChild(PreviousEpisode);
  AnimeDiv.appendChild(NextEpisode);

  onEpisodeChanged(currentEpisodeIndex);


  const animeDescription = "OT-Streaming VF";

  // Update the title with the anime name and description
  document.title = `${animeName} - ${animeDescription}`;
}

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
    console.error("Error fetching anime description from AniList API:", error);
    return "Pas de description disponible";
  }
}

// Call the loadAnimeDetails function when the page loads
window.onload = loadAnimeDetails;
