from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # Payment plans
    path('plans/', views.PaymentPlanListView.as_view(), name='plan_list'),
    
    # Transactions
    path('transactions/', views.TransactionListView.as_view(), name='transaction_list'),
    path('transactions/<uuid:pk>/', views.TransactionDetailView.as_view(), name='transaction_detail'),
    
    # Course purchases
    path('purchase/course/<int:course_id>/', views.purchase_course, name='purchase_course'),
    path('purchase/plan/<int:plan_id>/', views.subscribe_plan, name='subscribe_plan'),
    
    # Payment processing
    path('stripe/webhook/', views.stripe_webhook, name='stripe_webhook'),
    path('paypal/webhook/', views.paypal_webhook, name='paypal_webhook'),
    
    # Subscriptions
    path('subscriptions/', views.SubscriptionListView.as_view(), name='subscription_list'),
    path('subscriptions/<int:pk>/cancel/', views.cancel_subscription, name='cancel_subscription'),
]