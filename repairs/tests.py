from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User, RepairProfile, ClientProfile, RepairRequest, Rating
from django.core.files.uploadedfile import SimpleUploadedFile
import os

class UserModelTests(TestCase):
    def test_create_repair_user(self):
        user = User.objects.create_user(
            username='repairman',
            email='repair@example.com',
            password='password123',
            user_type='repair'
        )
        self.assertEqual(user.user_type, 'repair')
        self.assertTrue(user.check_password('password123'))
    
    def test_create_client_user(self):
        user = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='password123',
            user_type='client'
        )
        self.assertEqual(user.user_type, 'client')
        self.assertTrue(user.check_password('password123'))

class RepairRequestAPITests(APITestCase):
    def setUp(self):
        # Create test users
        self.client_user = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='password123',
            user_type='client'
        )
        self.repair_user = User.objects.create_user(
            username='repairman',
            email='repair@example.com',
            password='password123',
            user_type='repair'
        )
        RepairProfile.objects.create(user=self.repair_user, skills='Plumbing, Electrical')
        
        # Create a test image
        self.test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'',
            content_type='image/jpeg'
        )
        
        # Authenticate as client
        self.client = APIClient()
        self.client.force_authenticate(user=self.client_user)
    
    def test_create_repair_request(self):
        url = reverse('repairrequest-list')
        data = {
            'repair': self.repair_user.id,
            'description': 'Fix my sink',
            'image': self.test_image
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RepairRequest.objects.count(), 1)
        self.assertEqual(RepairRequest.objects.get().description, 'Fix my sink')
    
    def test_list_repair_requests(self):
        # Create a repair request
        RepairRequest.objects.create(
            client=self.client_user,
            repair=self.repair_user,
            description='Fix my sink',
            image=self.test_image
        )
        
        url = reverse('repairrequest-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_update_repair_request_status(self):
        # Create a repair request
        repair_request = RepairRequest.objects.create(
            client=self.client_user,
            repair=self.repair_user,
            description='Fix my sink',
            image=self.test_image
        )
        
        # Authenticate as repair professional
        self.client.force_authenticate(user=self.repair_user)
        
        url = reverse('repairrequest-detail', args=[repair_request.id])
        data = {'status': 'accepted'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(RepairRequest.objects.get().status, 'accepted')

class RatingAPITests(APITestCase):
    def setUp(self):
        # Create test users
        self.client_user = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='password123',
            user_type='client'
        )
        self.repair_user = User.objects.create_user(
            username='repairman',
            email='repair@example.com',
            password='password123',
            user_type='repair'
        )
        RepairProfile.objects.create(user=self.repair_user, skills='Plumbing, Electrical')
        
        # Authenticate as client
        self.client = APIClient()
        self.client.force_authenticate(user=self.client_user)
    
    def test_create_rating(self):
        url = reverse('rating-list')
        data = {
            'repair': self.repair_user.id,
            'value': 5,
            'comment': 'Great service!'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rating.objects.count(), 1)
        self.assertEqual(Rating.objects.get().value, 5)
        
        # Check if average rating was updated
        self.repair_user.refresh_from_db()
        self.assertEqual(self.repair_user.repair_profile.average_rating, 5.0)
    
    def test_list_ratings(self):
        # Create a rating
        Rating.objects.create(
            client=self.client_user,
            repair=self.repair_user,
            value=5,
            comment='Great service!'
        )
        
        url = reverse('rating-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1) 