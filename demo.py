#!/usr/bin/env python
"""
Salahli Platform Demo Script

This script demonstrates the functionality of the Salahli platform by:
1. Creating a repair professional and a client
2. Creating a repair request
3. Updating the repair request status
4. Creating a rating

To run this script:
1. Make sure the Django server is running
2. Run this script: python demo.py
"""

import requests
import json
import os
from PIL import Image
import io

# API base URL
BASE_URL = 'http://localhost:8000/api'

def create_test_image():
    """Create a test image for the repair request"""
    img = Image.new('RGB', (100, 100), color='red')
    img_io = io.BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)
    return img_io

def register_repair_professional():
    """Register a repair professional"""
    url = f'{BASE_URL}/repair-signup/'
    data = {
        'username': 'demo_repair',
        'email': 'repair@demo.com',
        'password': 'password123',
        'phone_number': '+1234567890',
        'skills': 'Plumbing, Electrical, Carpentry'
    }
    response = requests.post(url, json=data)
    print(f"Repair professional registration: {response.status_code}")
    return response.json() if response.status_code == 201 else None

def register_client():
    """Register a client"""
    url = f'{BASE_URL}/client-signup/'
    data = {
        'username': 'demo_client',
        'email': 'client@demo.com',
        'password': 'password123',
        'phone_number': '+0987654321'
    }
    response = requests.post(url, json=data)
    print(f"Client registration: {response.status_code}")
    return response.json() if response.status_code == 201 else None

def login(username, password):
    """Login and get JWT token"""
    url = f'{BASE_URL}/token/'
    data = {
        'username': username,
        'password': password
    }
    response = requests.post(url, json=data)
    print(f"Login: {response.status_code}")
    return response.json() if response.status_code == 200 else None

def get_repair_professionals(token):
    """Get list of repair professionals"""
    url = f'{BASE_URL}/repairs/'
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    print(f"Get repair professionals: {response.status_code}")
    return response.json() if response.status_code == 200 else None

def create_repair_request(token, repair_id):
    """Create a repair request"""
    url = f'{BASE_URL}/repair-requests/'
    headers = {'Authorization': f'Bearer {token}'}
    
    # Create a test image
    img_io = create_test_image()
    
    data = {
        'repair': repair_id,
        'description': 'I need help fixing my kitchen sink. It\'s leaking and I can\'t turn it off completely.'
    }
    
    files = {
        'image': ('test.jpg', img_io, 'image/jpeg')
    }
    
    response = requests.post(url, data=data, files=files, headers=headers)
    print(f"Create repair request: {response.status_code}")
    return response.json() if response.status_code == 201 else None

def update_repair_request_status(token, request_id):
    """Update repair request status"""
    url = f'{BASE_URL}/repair-requests/{request_id}/'
    headers = {'Authorization': f'Bearer {token}'}
    data = {'status': 'accepted'}
    response = requests.patch(url, json=data, headers=headers)
    print(f"Update repair request status: {response.status_code}")
    return response.json() if response.status_code == 200 else None

def create_rating(token, repair_id):
    """Create a rating"""
    url = f'{BASE_URL}/ratings/'
    headers = {'Authorization': f'Bearer {token}'}
    data = {
        'repair': repair_id,
        'value': 5,
        'comment': 'Excellent service! Fixed my sink quickly and professionally.'
    }
    response = requests.post(url, json=data, headers=headers)
    print(f"Create rating: {response.status_code}")
    return response.json() if response.status_code == 201 else None

def main():
    print("=== Salahli Platform Demo ===")
    
    # Register users
    repair_data = register_repair_professional()
    client_data = register_client()
    
    if not repair_data or not client_data:
        print("Failed to register users. Exiting.")
        return
    
    # Login as client
    client_token = login('demo_client', 'password123')
    if not client_token:
        print("Failed to login as client. Exiting.")
        return
    
    # Get repair professionals
    repairs = get_repair_professionals(client_token['access'])
    if not repairs:
        print("Failed to get repair professionals. Exiting.")
        return
    
    repair_id = repairs['results'][0]['id']
    
    # Create repair request
    request_data = create_repair_request(client_token['access'], repair_id)
    if not request_data:
        print("Failed to create repair request. Exiting.")
        return
    
    request_id = request_data['id']
    
    # Login as repair professional
    repair_token = login('demo_repair', 'password123')
    if not repair_token:
        print("Failed to login as repair professional. Exiting.")
        return
    
    # Update repair request status
    update_data = update_repair_request_status(repair_token['access'], request_id)
    if not update_data:
        print("Failed to update repair request status. Exiting.")
        return
    
    # Login back as client
    client_token = login('demo_client', 'password123')
    if not client_token:
        print("Failed to login as client. Exiting.")
        return
    
    # Create rating
    rating_data = create_rating(client_token['access'], repair_id)
    if not rating_data:
        print("Failed to create rating. Exiting.")
        return
    
    print("\n=== Demo Completed Successfully ===")
    print("You can now log in to the platform with:")
    print("Client: demo_client / password123")
    print("Repair Professional: demo_repair / password123")

if __name__ == "__main__":
    main() 