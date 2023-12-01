// server.mjs
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path"; // Import the 'path' module
import { fileURLToPath } from "url"; // Import the 'url' module
import { translate } from "@vitalets/google-translate-api";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import bodyParser from "body-parser";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: "ot-streaming",
    private_key_id: "99d55281c800cb9df075ca4a3520706bb02d3777",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDGHCE+j7fDFpnW\nrBC5ecf5YGUnWZCAVa0t7l91HVdTQZLhWrO+DWGb5EtADm+AKQfF1R9gjxTcPgAI\nqyXXDkZtj/Mtc11oC3Fg89KLn+SLZnSbbWlr1QB9q+n1/FROcynPV8asFF5LxEqI\nOQ1h6U39qWg1khQMI7VQY9GAtUp9v88SZpTnhaMkbcU/JBG1f85h68TEZIF+S4x9\nZGXglrh137co+kIpQgsznfyZ/WcfMhdr9ddDQM4QBVYxIzoPX/NlIvDZvaflwPY5\nPESzbYHgaWP2I0jPE1CieRNTz0R+IBO9rL4dPmEAWaiElVXTJrNB0g3zqGEcfpIK\nhEnl9L4VAgMBAAECggEADHOCJ2NzAkDuZE6mMnIT/nlvghyf92DrJILh3wN8FJB/\ngchomZ5PrzOXAyylF2H8yhNOCIyVnA4NhH31P+H2zTYJ66ZfjYWCl7xbVEk1XQmQ\ndKBYyt01TbC7YKl+Rvv3+b8jjnctQgfRQ2SKkcfPDg1SrmNC/UxVPfs4FKXQS7zg\n7us8ElY9fU2Hof2nY68/q8FgW9huhxlgeNxeLTlf0qp+39Pj2+pzsv6oX+7EyXP8\n3L64cF++XT6AVMw2ipMByjy3MJ/EeUw61vm/zbi3tUcOJtyOps/AzZbrOAwMyPMi\noZI0AWtP4LZeYuBgqpaAicoCwyV9rdblKaDFxXIFVQKBgQD9QovYrSaekJpT8PTS\ncR2xitCeLh9N/GNqxdCMEo5hDc7wLVjU8EZAkF51NLXionlOD4aU2F2W5pnk0xlm\nB3IVgeaMPGDCWHzexXFV7Uo898/Us4/eMtn+SG52r6OKdKvhiuqWSkcM3xhsEoxn\nH2VgdrmhYF+zAM+gpjbBjXIAkwKBgQDIQNWjtHp/2e5bpP3gJ7Elioh3nj0ZL0B5\nlXdyCbm3rQiKLdz8nfWpm5TW2Z38rGfYqrVqn5SMbwmE7SNp0/++XKXGS4M83rPE\nt3BEoy0vxw2RoIEMzSx6+ijkLeF3eSTq3f6noUmpBtNI7C0h+pjLCZXPgoyvJOh+\noOd0sUZ3twKBgQCxnF7I+T2xTEX/AmgfwZaKcYi2ti/cGFl8gvgrk8PoSq/K/nJi\n+5K5KsYjunCoXTtnRDok3sxbzKM2t9kDFcurS6tsw9cz1KzV6m/+S+iZc018pOUL\ndmwtCYz2jVzK9+Gmzi6Qccz8OOU+vY9brsgA66Jpi1XyCmqSBp82BEVkIwKBgQCo\nGjz9Ypje0KwWBIgV7lv33rY2bABwLslaB02wzlc3yCp+DIgRC+zYh0FHpoDIRlYa\nfRszuWhzBxcfng33Xb63J4EF2AgARhb0kOTOyYg6LkfGss0CWQ344h0HhzhZGboS\n625Fe9Cg8pjVA2XTu1EeSBqZisbclAgTnLEPtW0pOwKBgQDi5y3PyMx0Mb94+TKV\n1rJCfJ2lrA4VtvVX+p+AX4yFCT04VpDKO+evbctnFq0dUO2aVk+0rqUZL8vCxydZ\n0eWnavki17aUUcqGuDzULMIT3QFKLwZJ7tzk3Vfg2IZUBk5ojBL1LufRRAacXShn\nG0mPIL8N4diQkQIUwpkBl0BIxw==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-f507p@ot-streaming.iam.gserviceaccount.com",
    client_id: "102326331420631354904",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-f507p%40ot-streaming.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
});

const db = getFirestore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const Localhost = "localhost:";
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (including data.json)
app.use(express.static(path.join(__dirname, "public")));

// Pinging interval in milliseconds
const urls = [
  "https://ugluzw.onrender.com/",
  "https://ot-streaming.onrender.com/",
];
const pingSuccess = "ping success";
const method = "GET";
const toStr = "toString";
const consoleError = "error in pingService";
const appType = "application/json";
const pingInterval = 10000; // 10 minutes interval

function pingService(url) {
  return fetch(url, {
    method: method,
    headers: {
      Accept: appType,
      "Content-Type": appType,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        console.log(`Ping to ${url} successful`);
      } else {
        console.error(
          `Ping to ${url} returned status code: ${response.status}`
        );
      }
      return response[toStr]();
    })
    .catch((error) => {
      console.error(consoleError, error);
    });
}

// Route to translate text
app.post("/api/translate", async (req, res) => {
  const textToTranslate = req.body.text;
  console.log(textToTranslate);
  try {
    // Perform translation using the translate function
    const translationResult = await translate(textToTranslate, { to: "fr" });
    const translatedText = translationResult.text;

    res.json({ message: translatedText });
    console.log(translatedText, textToTranslate);
  } catch (error) {
    console.error("Error translating text:", error);
    res.json({ message: textToTranslate });
  }
});


// Route to add a new episode to an existing anime
app.post("/api/addEpisode", async (req, res) => {
    try {
      const newEpisode = req.body;
  
// Check if required fields are present in the request body
const missingFields = [];
if (!newEpisode.anime) missingFields.push("anime");
if (!newEpisode.episodeNumber) missingFields.push("episodeNumber");
if (!newEpisode.embedCode) missingFields.push("embedCode");
if (!newEpisode.nextEpisodeNumber) missingFields.push("nextEpisodeNumber");

if (missingFields.length > 0) {
  return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
}

  
      // Create a reference to the anime document based on the provided anime
      const animeRef = db.collection("anime").doc(newEpisode.anime.toLowerCase()).collection("episodes").doc(newEpisode.episodeNumber.toString());
  
    
     
      await animeRef.set({
        "episodeNumber": newEpisode.episodeNumber,
        'embedCode': newEpisode.embedCode,
      });
      res.json({ message: "Episode added successfully" });
    } catch (error) {
      console.error("Error adding episode:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

app.post("/api/addFeaturedAnime", async (req, res) => {
   const newFeaturedAnime = req.body;
   const data = await db.collection("featuredanime").doc(newFeaturedAnime.name);

  data.set({
    name: newFeaturedAnime.name,
    thumbnail: newFeaturedAnime.thumbnail
  })

  // // Initialize featuredAnime array if not already defined
  // data.featuredAnime = data.featuredAnime || [];

  // // Add the new featured anime to the list
  // data.featuredAnime.push(newFeaturedAnime);
  // console.log(newFeaturedAnime);
  // //  const docRef = db.collection().doc('alovelace');
  
  res.json({ message: "Featured anime added successfully" });
});

// Route to get anime details
app.get("/api/getAnimeDetails", async (req, res) => {
  const animeName = req.query.name;
  console.log(animeName);

  const snapshot = await db.collection("anime").get();
  let animeFound = false;

  snapshot.forEach((doc) => {
    if (doc.id == animeName) {
      animeFound = true;
      res.json(doc.data());
    }
    console.log(doc.id, "=>", doc.data());
  });

  if (!animeFound) {
    res.status(404).json({ error: "Anime not found" });
  }
});

app.get("/api/getEpisodeDetails", async (req, res) => {
    const episodeId = req.query.episode;
    const animeName = req.query.animeName;

    try {
        const docRef = db.collection("anime").doc(animeName).collection("episodes").doc(episodeId);
        const doc = (await docRef.get());
        
        if (doc.exists) {
            const episodeData = doc.data();
            res.json(episodeData);
            console.log(doc.id, "=>", episodeData);
        } else {
            res.status(404).json({ error: "Episode not found" });
        }
    } catch (error) {
        console.error("Error fetching episode details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to get the list of featured anime
app.get("/api/getFeaturedAnime", async (req, res) => {
  const file = await db.collection("featuredanime").get();
  const data = [];
  file.forEach((doc) => {
    
    data.push(doc.data());
  })
  res.json(data);
});
const defaultData = {
  animeList: [],
  featuredAnime: [],
};
const dataPath = path.join(__dirname, "data.json");
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), "utf8");
}
// Route to delete an episode
app.delete("/api/deleteEpisode", async (req, res) => {
  try {
    const animeTitle = req.body.anime;
    const episodeNumber = parseInt(req.body.episodeNumber);
    console.log("Anime Title:", animeTitle);
    console.log("Episode Number:", episodeNumber);
    
    const episodeRef = await db.collection("anime").doc(`${animeTitle.toLowerCase()}`).collection("episodes").doc(`${episodeNumber}`).get();
    console.log(episodeRef.id, "=>", episodeRef.data());
    
  await episodeRef.ref.set({
    "episodeNumber": episodeNumber,
    'embedCode': null,
  });
  res.status(200).json({message: "Episode deleted successfully"})

  } catch (error) {
    console.error("Error deleting episode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/searchAnime", async (req, res) => {
  const query = req.query.query;

  try {
    const snapshot = await db.collection("anime").get();

    let matchingAnime = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      // Use startsWith for case-insensitive search
      if (id.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
     
        matchingAnime.push(id);
      }
    });

    res.json(matchingAnime);
  } catch (error) {
    console.error("Error searching for anime:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/api/login", async (req, res) => {
  const Username = req.body.username;
  const Password = req.body.password;
 // Assuming you have already initialized Firebase and obtained the 'db' reference

const usersCollection = db.collection("users");

// Get all documents in the "users" collection
usersCollection.get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is an object representing the document
      const userData = {};
      userData.username = doc.id;
      userData.password = doc.data().password;
      console.log(req.body, " / => ", doc.data()," / => ", userData.password);
      if(userData.username == Username && userData.password == Password) {
        res.status(200).json({ message: "Logged in with success"});
      } else {
        res.status(403).json({message: "Invalid User authentication"})
      }
      // You can perform further actions with the user data here
    });
  })
  .catch((error) => {
    console.error("Error getting users:", error);
  });

})


app.post("/api/addAnime", async (req, res) => {
    const newAnime = req.body;
  
    const existingAnime = await db.collection("anime").doc(newAnime.title.toLowerCase()).get();
  
    // Check if the anime already exists
    let animeExist = false;
  if(existingAnime.exists) {

    animeExist = true;


  }
      
  
    if (animeExist) {
      res.status(400).json({ error: "Anime already exists" });
      return;
    }
  
    // Create a new anime object
    const animeObject = {
      title: newAnime.title,
      totalEpisodes: newAnime.totalEpisodes,
      episodes: [], // Initialize episodes as an empty array
    };
  
    console.log("Title:", animeObject.title);
    console.log("Total Episodes:", animeObject.totalEpisodes);
    // Add the anime data to Firestore
    const animeDocRef = db.collection("anime").doc(animeObject.title);
    await animeDocRef.set({
      totalEpisodes: animeObject.totalEpisodes,
    });
  
    for (let episode = 1; episode <= animeObject.totalEpisodes; episode++) {
      const episodeContainers = db
        .collection("anime")
        .doc(animeObject.title)
        .collection("episodes")
        .doc(episode.toString()); 
      await episodeContainers.set({ episodeNumber: episode, embedCode: null });
    }
  
    res.status(200).json({ message: "Anime Added Succesfully"});
  });
  

app.use("/data/test", (req, res, next) => {
  // Check if the requested URL includes ".js"
  if (
    req.url.includes("FSES.js") ||
    req.url.includes("FSESObfuscated.js") ||
    req.url.includes("/UUID/script.js")
  ) {
    // Respond with a 403 status code and a message
    return res.status(403).send("No Permission to access JavaScript files");
  }
  // Allow access to other files within "/data/test"
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port http://${Localhost + "" + port}`);

  setInterval(() => {
    // Call the pingService function for each URL you want to ping
    pingService(urls[0]); // Pinging the first URL
    pingService(urls[1]); // Pinging the second URL
  }, pingInterval);
});
