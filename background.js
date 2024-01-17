// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "searchAndParseTabs") {
      searchAndParseTabs("*://*.spotify.com/playlist/*");
  }
});

function searchAndParseTabs(url) {
  chrome.tabs.query({url: url}, function(tabs) {
      tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {action: "parsePlaylist"}, function(response) {
              if (chrome.runtime.lastError) {
                  console.error("Error in sending message to tab ID", tab.id, ": ", chrome.runtime.lastError.message);
                  return;
              }

              if (response && response.playlistData) {
                  let playlistData = response.playlistData;
                  chrome.storage.local.set({[tab.id]: playlistData}, function() {
                      console.log('Data stored for tab', tab.id, playlistData);
                  });
              } else {
                  console.log("No response or playlist data received from tab ID", tab.id);
              }
          });
      });
  });
}

function initiatePlaylistCreationOnYouTubeMusic() {
  chrome.storage.local.get(null, function(items) {
      Object.keys(items).forEach(key => {
          const playlistData = items[key];
          // Find YouTube Music tab specifically
          chrome.tabs.query({url: "https://music.youtube.com/library/playlists"}, function(tabs) {
              if (tabs.length > 0) {
                  let youTubeMusicTab = tabs[0]; // Assuming the first tab is the one we want
                  chrome.tabs.sendMessage(youTubeMusicTab.id, {action: "createPlaylist", playlistName: playlistData.name_of_playlist});
              } else {
                  console.error("YouTube Music tab not found");
              }
          });
      });
  });
}
// Example usage
initiatePlaylistCreationOnYouTubeMusic();
