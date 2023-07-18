//NOTE: this worker is sandboxed and does not have access to DOM APIs... only responds to chrome events, not DOM events

// const API_ENDPOINT =
//   "https://b3703f7e-38c3-4bf1-b6d8-ad50e77a755f.mock.pstmn.io/";

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.tabs.sendMessage(tab.id, { event: "ACTION_CLICKED" });
});

// global error handler for chrome apis
// chrome.tabs.executeScript(tabId, details, () => {
//   if (chrome.runtime.lastError) {
//     var errorMsg = chrome.runtime.lastError.message;
//     console.log(errorMsg);
//   }
// });
