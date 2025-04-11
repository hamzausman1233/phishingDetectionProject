// content.js
function createOverlay() {
  if (document.getElementById("phishing-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "phishing-overlay";
  overlay.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: white;
    padding: 12px;
    border: 2px solid black;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  `;
  overlay.innerHTML = `
    <h4 style="margin: 0 0 5px;">Phishing Detector</h4>
    <p id="verdict">Scanning...</p>
    <a id="report-link" target="_blank">See full report</a>
  `;
  document.body.appendChild(overlay);

  // Set link to the front_end.html page within the extension
  const reportLink = document.getElementById("report-link");
  reportLink.href = chrome.runtime.getURL("front_end.html");
}

function extractText() {
  const subjectElem = document.querySelector("h2.hP");
  const bodyElem = document.querySelector("div.a3s");

  if (!subjectElem) console.log("Could not find subject element (h2.hP)");
  if (!bodyElem) console.log("Could not find body element (div.a3s)");

  const subject = subjectElem ? subjectElem.innerText.trim() : "";
  const body = bodyElem ? bodyElem.innerText.trim() : "";

  console.log("Extracted subject:", subject);
  console.log("Extracted body:", body);

  const fullText = subject + ". " + body;
  return { subject, fullText };
}

function waitForEmailContent(callback) {
  const checkContent = () => {
    const subjectElem = document.querySelector("h2.hP");
    const bodyElem = document.querySelector("div.a3s");
    if (
      subjectElem && 
      bodyElem &&
      subjectElem.innerText.trim() !== "" &&
      bodyElem.innerText.trim() !== ""
    ) {
      callback();
    } else {
      console.log("Waiting for email content to load...");
      setTimeout(checkContent, 1000);
    }
  };
  checkContent();
}

createOverlay();

waitForEmailContent(() => {
  const { subject, fullText } = extractText();
  chrome.runtime.sendMessage(
    { action: "checkPhishing", subject: subject, text: fullText, url: window.location.href },
    (response) => {
      console.log("Response from background:", response);
      let verdictText = "Unknown";

      if (response?.predictions?.[0]?.result) {
        verdictText = `Verdict: ${response.predictions[0].result.verdict}
(Score: ${response.predictions[0].result.average_probability.toFixed(3)})`;
      } else if (response?.error) {
        verdictText = "Error: " + response.error;
      }

      document.getElementById("verdict").innerText = verdictText;
    }
  );
});

