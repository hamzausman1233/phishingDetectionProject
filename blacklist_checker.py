import requests

# URL to get the latest blacklist (example using PhishTank)
PHISHTANK_API_URL = "https://data.phishtank.com/data/online-valid.json"

def check_url(url):
    try:
        response = requests.get(PHISHTANK_API_URL)
        blacklist = response.json()  # Assume it returns a list of phishing URLs
        # Check if the given URL is in the blacklist (modify condition as needed)
        return any(entry.get("url") == url for entry in blacklist)
    except Exception as e:
        print("Error checking URL:", e)
        return False

