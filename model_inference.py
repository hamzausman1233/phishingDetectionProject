import re
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import os

model_path = os.path.join(os.path.dirname(__file__), "model_files")

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

def predict_phishing(text):
    # Debug: log the received text
    print(f"[DEBUG] Received text: {repr(text)}")
    
    sentences = re.split(r'[.!?]', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    results = []
    total_prob = 0.0

    for sentence in sentences:
        inputs = tokenizer(sentence, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
            prob = torch.softmax(outputs.logits, dim=1)[0][1].item()
            results.append((sentence, prob))
            total_prob += prob

    avg_prob = total_prob / len(results) if results else 0
    phishy_sentences = [s for s, p in results if p > 0.499]

    return {
        "verdict": "phishy" if avg_prob > 0.499 else "safe",
        "average_probability": avg_prob,
        "phishy_sentences": phishy_sentences,
        "sentence_scores": results
    }

