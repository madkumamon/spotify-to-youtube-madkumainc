document.getElementById('parseButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "searchAndParseTabs"});
});