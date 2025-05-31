import requests

# --- Configuration ---
# Replace with the actual access token for your client user (e.g., new_client)
CLIENT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4NzA5ODc5LCJpYXQiOjE3NDg2MjM0NzksImp0aSI6ImE0NjUyOTk5ZGI2OTQyNmI4OWYyMjNiNWY1YTJlOGFkIiwidXNlcl9pZCI6NH0.Bw8JK1OyxQwYjpP818vdBKhjzqdWt1smBdRo0vP6iKQ"

# Replace with the actual ID of the repair professional (e.g., 3 for manual_repair)
REPAIR_PROFESSIONAL_ID = 3

# Path to the image file on your computer
IMAGE_FILE_PATH = "C:/Users/Timgad Info/Desktop/o.jpg" # <<< IMPORTANT: Change this path!

# --- Request Data ---
url = "http://localhost:8000/api/repair-requests/"
headers = {
    "Authorization": f"Bearer {CLIENT_TOKEN}"
}
data = {
    "repair": REPAIR_PROFESSIONAL_ID,
    "description": "Testing repair request with Python script",
    "device_type": "phone" # Or 'pc'
}

# --- Send Request with File ---
try:
    with open(IMAGE_FILE_PATH, 'rb') as f:
        files = {'image': (IMAGE_FILE_PATH.split('/')[-1], f, 'image/jpeg')} # Adjust content type if needed (image/png, etc.)
        response = requests.post(url, headers=headers, data=data, files=files)

    # --- Print Response ---
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    try:
        print(response.json())
    except json.JSONDecodeError:
        print(response.text)

except FileNotFoundError:
    print(f"Error: Image file not found at {IMAGE_FILE_PATH}")
except Exception as e:
    print(f"An error occurred: {e}")
