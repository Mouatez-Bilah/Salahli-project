from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.db.models import Avg
from django.core.exceptions import ValidationError

def validate_image_size(value):
    filesize = value.size
    if filesize > 5 * 1024 * 1024:  # 5MB limit
        raise ValidationError("The maximum file size that can be uploaded is 5MB")

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    password_reset_token = models.CharField(max_length=100, blank=True, null=True)
    user_type = models.CharField(
        max_length=10,
        choices=[('repair', 'Repair'), ('client', 'Client')],
        default='client'
    )
    
    def __str__(self):
        return self.username

class RepairProfile(models.Model):
    SKILL_CHOICES = [
        ('laptop', 'Laptop Repair'),
        ('phone', 'Phone Repair'),
        ('tablet', 'Tablet Repair'),
        ('printer', 'Printer Repair'),
        ('other', 'Other')
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='repair_profile')
    skills = models.CharField(max_length=255, blank=True, null=True, help_text="Main repair skill")
    custom_skills = models.TextField(blank=True, null=True, help_text="Additional skills or specializations")
    address = models.TextField(blank=True, null=True)
    average_rating = models.FloatField(default=0.0)
    
    def __str__(self):
        return f"{self.user.username}'s Repair Profile"

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    
    def __str__(self):
        return f"{self.user.username}'s Client Profile"

class RepairRequest(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    repair = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    description = models.TextField()
    image = models.ImageField(
        upload_to='repair_requests/',
        validators=[validate_image_size, FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        help_text="Upload an image of the item that needs repair (max 5MB)"
    )
    status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Request from {self.client.username} to {self.repair.username}"
    
    class Meta:
        indexes = [
            models.Index(fields=['client', 'status']),
            models.Index(fields=['repair', 'status']),
        ]

class Rating(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_ratings')
    repair = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_ratings')
    value = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('client', 'repair')
    
    def __str__(self):
        return f"{self.client.username} rated {self.repair.username}: {self.value}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update average rating for the repair using aggregation
        avg_rating = Rating.objects.filter(repair=self.repair).aggregate(Avg('value'))['value__avg'] or 0.0
        RepairProfile.objects.filter(user=self.repair).update(average_rating=avg_rating)
