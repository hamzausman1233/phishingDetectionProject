// front_end.js

function detectLanguage(text) {
  const germanWords = ["bitte", "konto", "überprüfung", "klicken", "freundlichen", "sicherheitsdienst"];
  const frenchWords = ["veuillez", "confirmer", "sécurité", "cordialement", "compte", "vérification"];

  let germanCount = 0;
  let frenchCount = 0;

  const lowerText = text.toLowerCase();
  for (const word of germanWords) {
    if (lowerText.includes(word)) germanCount++;
  }
  for (const word of frenchWords) {
    if (lowerText.includes(word)) frenchCount++;
  }

  if (germanCount > frenchCount) return "German";
  if (frenchCount > germanCount) return "French";
  return "Unknown";
}

function showAnalysis(verdict) {
  const analysisDiv = document.getElementById("analysis");

  // If no verdict or predictions, bail out
  if (!verdict || !verdict.predictions || !verdict.predictions.length) {
    analysisDiv.innerText = "Aucune donnée d'analyse disponible.";
    return;
  }

  const result = verdict.predictions[0].result;
  const text = verdict.predictions[0].text;
  const subject = verdict.predictions[0].subject || "No Subject";

  const verdictString = result.verdict;
  const avgScore = result.average_probability.toFixed(3);
  const phishySentences = result.phishy_sentences;

  // If verdict is 'phishy', let's guess the language
  const lang = (verdictString === "phishy") ? detectLanguage(text) : "N/A";

  analysisDiv.innerHTML = `
    <h2>Sujet: ${subject}</h2>
    <p><strong>Verdict:</strong> ${verdictString}</p>
    <p><strong>Avg Score:</strong> ${avgScore}</p>
    <p><strong>Detected Language:</strong> ${lang}</p>
    <h3>Phishy Sentences:</h3>
    <ul>${phishySentences.map(s => `<li>${s}</li>`).join("")}</ul>
    <h3>Texte complet:</h3>
    <p>${text}</p>
  `;
}

let attempts = 0;
function tryLoadVerdict() {
  // Attempt to retrieve the verdict from chrome.storage.local
  chrome.storage.local.get("verdict", (data) => {
    if (data && data.verdict) {
      showAnalysis(data.verdict);  // Pass in the actual verdict object
    } else if (attempts < 10) {
      attempts++;
      setTimeout(tryLoadVerdict, 300); // Retry after 300ms
    } else {
      document.getElementById("analysis").innerText = "Impossible de charger l'analyse.";
    }
  });
}

// Start loading once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  tryLoadVerdict();
});

