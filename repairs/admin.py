from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, RepairProfile, ClientProfile, RepairRequest, Rating

class RepairProfileInline(admin.StackedInline):
    model = RepairProfile
    can_delete = False

class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone_number', 'user_type', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'user_type')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'user_type')}),
    )
    inlines = [RepairProfileInline, ClientProfileInline]

admin.site.register(User, CustomUserAdmin)
admin.site.register(RepairRequest)
admin.site.register(Rating)
