from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course
import uuid

User = get_user_model()

class PaymentPlan(models.Model):
    PLAN_TYPE_CHOICES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    ]
    
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=15, choices=PLAN_TYPE_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration_days = models.PositiveIntegerField(default=30)
    
    features = models.JSONField(default=list)
    max_courses = models.PositiveIntegerField(default=0)  # 0 = unlimited
    max_live_sessions = models.PositiveIntegerField(default=0)  # 0 = unlimited
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payment_plans'
    
    def __str__(self):
        return f"{self.name} - ${self.price}"

class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('course_purchase', 'Course Purchase'),
        ('subscription', 'Subscription'),
        ('refund', 'Refund'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('easypaisa', 'Easypaisa'),
        ('jazzcash', 'JazzCash'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    plan = models.ForeignKey(PaymentPlan, on_delete=models.SET_NULL, null=True, blank=True)
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    payment_method = models.CharField(max_length=15, choices=PAYMENT_METHOD_CHOICES)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True)
    paypal_order_id = models.CharField(max_length=100, blank=True)
    external_transaction_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - ${self.amount} ({self.status})"

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('paused', 'Paused'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(PaymentPlan, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    cancelled_at = models.DateTimeField(blank=True, null=True)
    
    stripe_subscription_id = models.CharField(max_length=100, blank=True)
    auto_renew = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'subscriptions'
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name} ({self.status})"

class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=15, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=8, decimal_places=2)
    
    max_uses = models.PositiveIntegerField(default=1)
    used_count = models.PositiveIntegerField(default=0)
    
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    applicable_courses = models.ManyToManyField(Course, blank=True)
    applicable_plans = models.ManyToManyField(PaymentPlan, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'coupons'
    
    def __str__(self):
        return f"{self.code} - {self.discount_value}"

class Refund(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
    ]
    
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='refund')
    reason = models.TextField()
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(blank=True, null=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_refunds')
    
    class Meta:
        db_table = 'refunds'
    
    def __str__(self):
        return f"Refund for {self.transaction.id} - ${self.amount}"
