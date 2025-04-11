from flask import Flask, request, jsonify
from flask_cors import CORS
from model_inference import predict_phishing

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    subject = data.get("subject", "")
    text = data.get("text", "")
    url = data.get("url", "")

    print(f"[DEBUG] /predict endpoint received data: {data}")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = predict_phishing(text)
    # Include subject and url in the response along with the analysis.
    prediction = {
        "subject": subject,
        "text": text,
        "url": url,
        "result": result
    }

    return jsonify({"predictions": [prediction], "blacklisted_urls": []})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

