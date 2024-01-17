// content.js

// Function to extract playlist data from Spotify
function extractPlaylistData() {
  let playlistData = {
      name_of_playlist: "",
      songs: []
  };

  const playlistNameElement = document.querySelector('div[role="grid"][data-testid="playlist-tracklist"]');
  if (playlistNameElement) {
      playlistData.name_of_playlist = playlistNameElement.getAttribute('aria-label');
  }

  const songRows = document.querySelectorAll('[data-testid="tracklist-row"]');
  songRows.forEach(row => {
      let song = {
          artist: '',
          title: '',
          album: ''
      };

      let artistCell = row.querySelector('div[role="gridcell"][aria-colindex="3"]');
      let titleCell = row.querySelector('div[role="gridcell"][aria-colindex="2"]');
      let albumCell = row.querySelector('div[role="gridcell"][aria-colindex="4"]');

      if (artistCell) song.artist = artistCell.innerText.trim();
      if (titleCell) song.title = titleCell.innerText.trim();
      if (albumCell) song.album = albumCell.innerText.trim();

      playlistData.songs.push(song);
  });

  return playlistData;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "parsePlaylist") {
      const playlistData = extractPlaylistData();
      sendResponse({playlistData: playlistData});
  }
});

function createPlaylistOnYouTubeMusic(playlistName) {
  // Step 1: Click "New playlist" button
  const newPlaylistButton = document.querySelector('[aria-label="New playlist"]');
  newPlaylistButton.click();

  // Step 2: Wait for the form to be ready
  setTimeout(() => {
      // Target the input field
      const playlistNameInput = document.querySelector('.style-scope.tp-yt-paper-input');
      if (playlistNameInput) {
          playlistNameInput.focus();

          // Simulate typing each character of the playlist name
          [...playlistName].forEach(char => {
              const event = new KeyboardEvent('keypress', {'key': char});
              playlistNameInput.dispatchEvent(event);
          });

          // After typing, wait a bit and then click the create button
          setTimeout(() => {
              const createButton = document.querySelector('[aria-label="Create"]');
              if (createButton) {
                  createButton.click();
              } else {
                  console.error('Create button not found');
              }
          }, 1000); // Adjust the timeout as needed
      } else {
          console.error('Playlist name input field not found');
      }
  }, 2000); // Adjust the timeout as needed for the modal to appear
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "createPlaylist") {
      createPlaylistOnYouTubeMusic(request.playlistName);
      sendResponse({status: "Playlist creation initiated"});
  }
});
