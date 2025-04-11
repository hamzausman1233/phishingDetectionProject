// background.js
let lastVerdict = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkPhishing") {
    console.log("Background received checkPhishing message:", request);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: request.subject,
        text: request.text,
        url: request.url
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response from Flask backend:", data);
        lastVerdict = data;   // keep a local copy
        chrome.storage.local.set({ verdict: data });  // store in local storage
        sendResponse(data);
      })
      .catch(error => {
        console.error("Error in fetch:", error);
        sendResponse({ error: error.message });
      });

    // Must return true to indicate we'll respond asynchronously
    return true;
  }

  if (request.action === "getLastVerdict") {
    sendResponse(lastVerdict);
  }
});

