# OT Streaming Admin Panel


<div align="center">
  <img src="https://i.ibb.co/Jn7NnJL/output.png" alt="OT Streaming Logo" width="200">
</div>

## Description

OT Streaming Admin Panel is a web application that allows administrators to manage anime episodes and featured anime for the OT Streaming platform. It provides a user-friendly interface for adding, deleting, and managing episodes and featured anime.

## Features

- Add new anime episodes with embed codes
- Delete existing anime episodes
- Add and manage featured anime with thumbnails
- User-friendly web interface for easy management

## Getting Started

### Prerequisites

- Node.js (version 20.3.0)
- npm (version 9.7.1)
- Express.js (version 4.18.2)
- ...

### Installation

1. Clone the repository: `git clone https://github.com/your-username/ot-streaming-admin.git`
2. Navigate to the project directory: `cd ot-streaming-admin`
3. Install dependencies: `npm install`

### Usage

1. Run the server: `npm start`
2. Access the admin panel in your browser: `http://localhost:3000/admin`

## Data Structure

The anime and episode data is stored in a JSON file named `data.json`. The JSON structure looks like this:

```json
[
  {
    "title": "Naruto",
    "description": "A popular anime series about ninjas.",
    "episodes": [
      {
        "anime": "Naruto",
        "episodeNumber": 1,
        "embedCode": "<IFRAME SRC=\"...\" FRAMEBORDER=0 ...></IFRAME>",
        "nextEpisode": 2
      },
      {
        "anime": "Naruto",
        "episodeNumber": 2,
        "embedCode": "<IFRAME SRC=\"...\" FRAMEBORDER=0 ...></IFRAME>",
        "nextEpisode": 3
      }
    ]
  },
  {
    "title": "OnePiece",
    "description": "A popular anime series about Pirates.",
    "episodes": []
  }
]

```
# Contributing
Contributions are welcome! If you find a bug or want to suggest an improvement, please open an issue or submit a pull request.

License
This project is licensed under the MIT License.
