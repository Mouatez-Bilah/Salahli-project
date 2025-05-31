from rest_framework import serializers
from .models import User, RepairProfile, ClientProfile, RepairRequest, Rating
from django.db import transaction

class RepairProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    address = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = RepairProfile
        fields = ['id', 'username', 'email', 'phone_number', 'skills', 'custom_skills', 'address', 'average_rating']

class RepairProfileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    phone_number = serializers.CharField(source='user.phone_number', required=False)
    
    class Meta:
        model = RepairProfile
        fields = ['username', 'email', 'phone_number', 'skills', 'custom_skills', 'address']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields if provided
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Update repair profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class ClientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    
    class Meta:
        model = ClientProfile
        fields = ['id', 'username', 'email', 'phone_number']

class ClientProfileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    phone_number = serializers.CharField(source='user.phone_number', required=False)
    
    class Meta:
        model = ClientProfile
        fields = ['username', 'email', 'phone_number']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields if provided
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Update client profile fields (currently none besides the user relation)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class UserSerializer(serializers.ModelSerializer):
    repair_profile = RepairProfileSerializer(required=False, read_only=True)
    client_profile = ClientProfileSerializer(required=False, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'user_type', 'repair_profile', 'client_profile']
        read_only_fields = ['id']

class RepairSignupSerializer(serializers.ModelSerializer):
    skills = serializers.ChoiceField(
        choices=RepairProfile.SKILL_CHOICES,
        required=False,
        allow_null=True,
        allow_blank=True
    )
    custom_skills = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    address = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'skills', 'custom_skills', 'address']
    
    def validate(self, data):
        # Validate that at least one of skills or custom_skills is provided
        if not data.get('skills') and not data.get('custom_skills'):
            raise serializers.ValidationError("Either skills or custom_skills must be provided")
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        skills = validated_data.pop('skills', None)
        custom_skills = validated_data.pop('custom_skills', None)
        address = validated_data.pop('address', None)
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            user_type='repair'
        )
        
        # Create repair profile
        RepairProfile.objects.create(
            user=user,
            skills=skills,
            custom_skills=custom_skills,
            address=address
        )
        
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
