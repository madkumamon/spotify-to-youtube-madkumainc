function extractPlaylistData() {
  let playlistData = {
      name_of_playlist: "",
      songs: []
  };

  // Extract the name of the playlist
  const playlistNameElement = document.querySelector('div[role="grid"][data-testid="playlist-tracklist"]');
  if (playlistNameElement) {
      playlistData.name_of_playlist = playlistNameElement.getAttribute('aria-label');
  }

  // Extract songs
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

// Use the function when needed, for example, on page load or via a button click
const playlistData = extractPlaylistData();
console.log(playlistData);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.action === "parsePlaylist") {
          const playlistData = extractPlaylistData();
          sendResponse(playlistData);
      }
  }
);