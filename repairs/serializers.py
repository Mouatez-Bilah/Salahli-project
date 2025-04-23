from rest_framework import serializers
from .models import User, RepairProfile, ClientProfile, RepairRequest, Rating
from django.db import transaction

class RepairProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairProfile
        fields = ['skills', 'average_rating']

class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = []  # No additional fields for now

class UserSerializer(serializers.ModelSerializer):
    repair_profile = RepairProfileSerializer(required=False)
    client_profile = ClientProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'user_type', 'repair_profile', 'client_profile']
        read_only_fields = ['id']

class RepairSignupSerializer(serializers.ModelSerializer):
    skills = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'skills']
    
    @transaction.atomic
    def create(self, validated_data):
        skills = validated_data.pop('skills')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            user_type='repair'
        )
        RepairProfile.objects.create(user=user, skills=skills)
        return user

class ClientSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number']
    
    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            user_type='client'
        )
        ClientProfile.objects.create(user=user)
        return user

class RepairRequestSerializer(serializers.ModelSerializer):
    client_username = serializers.ReadOnlyField(source='client.username')
    repair_username = serializers.ReadOnlyField(source='repair.username')
    
    class Meta:
        model = RepairRequest
        fields = ['id', 'client', 'client_username', 'repair', 'repair_username', 
                  'description', 'image', 'status', 'created_at']
        read_only_fields = ['id', 'client', 'client_username', 'status', 'created_at']

class RepairRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairRequest
        fields = ['repair', 'description', 'image']
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

class RepairRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairRequest
        fields = ['status']

class RatingSerializer(serializers.ModelSerializer):
    client_username = serializers.ReadOnlyField(source='client.username')
    
    class Meta:
        model = Rating
        fields = ['id', 'client', 'client_username', 'repair', 'value', 'comment', 'created_at']
        read_only_fields = ['id', 'client', 'client_username', 'created_at']
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)
