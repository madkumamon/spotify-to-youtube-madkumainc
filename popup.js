document.getElementById('parseButton').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "parsePlaylist"}, function(response) {
          document.getElementById('playlistData').textContent = JSON.stringify(response, null, 2);
      });
  });
});