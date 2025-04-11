// popup.js
chrome.storage.local.get("verdict", ({ verdict }) => {
  const reportDiv = document.getElementById("report");
  
  // If there's no data or no predictions, display a simple message
  if (!verdict?.predictions?.length) {
    reportDiv.innerText = "No data available";
    return;
  }

  // Use the first prediction
  const pred = verdict.predictions[0];
  
  reportDiv.innerHTML = `
    <p><strong>Verdict:</strong> ${pred.result.verdict}</p>
    <p><strong>Avg Score:</strong> ${pred.result.average_probability.toFixed(3)}</p>
    <p><strong>Phishy Sentences:</strong></p>
    <ul>${pred.result.phishy_sentences.map(s => `<li>${s}</li>`).join("")}</ul>
    <hr/>
    <p><strong>Full Text:</strong></p>
    <p>${pred.text}</p>
  `;
});

