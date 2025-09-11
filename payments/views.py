from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import PaymentPlan, Transaction, Subscription
from courses.models import Course
import stripe
import json
from decimal import Decimal

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentPlanListView(APIView):
    def get(self, request):
        plans = PaymentPlan.objects.filter(is_active=True)
        plan_data = []
        
        for plan in plans:
            plan_data.append({
                'id': plan.id,
                'name': plan.name,
                'description': plan.description,
                'price': str(plan.price),
                'currency': plan.currency,
                'billing_cycle': plan.billing_cycle,
                'features': plan.features,
                'is_popular': plan.is_popular
            })
        
        return Response({
            "plans": plan_data,
            "count": len(plan_data)
        })

class TransactionListView(APIView):
    def get(self, request):
        return Response({"transactions": [], "message": "Transactions feature coming soon"})

class TransactionDetailView(APIView):
    def get(self, request, pk):
        return Response({"transaction": None, "message": "Transaction details feature coming soon"})

class SubscriptionListView(APIView):
    def get(self, request):
        return Response({"subscriptions": [], "message": "Subscriptions feature coming soon"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_course(request, course_id):
    try:
        course = get_object_or_404(Course, id=course_id)
        user = request.user
        
        # Check if already enrolled
        if user.enrollments.filter(course=course).exists():
            return Response({'error': 'Already enrolled in this course'}, status=400)
        
        # Create payment intent (works for Pakistan)
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(course.price * 100),  # Stripe uses cents (100 paisa = 1 PKR)
                currency='pkr',  # Pakistani Rupee
                payment_method_types=['card'],  # Cards work in Pakistan
                metadata={
                    'course_id': course_id,
                    'user_id': user.id,
                    'type': 'course_purchase'
                }
            )
            
            # Create transaction record
            transaction = Transaction.objects.create(
                user=user,
                amount=course.price,
                currency='INR',
                transaction_type='course_purchase',
                stripe_payment_intent_id=intent.id,
                status='pending',
                course_id=course_id
            )
            
            return Response({
                'client_secret': intent.client_secret,
                'transaction_id': transaction.id,
                'amount': str(course.price),
                'currency': 'PKR',
                'course_title': course.title,
                'payment_methods': {
                    'cards': 'International Visa/Mastercard accepted',
                    'local': 'EasyPaisa, JazzCash, Bank Transfer also available',
                    'note': 'All major Pakistani banks supported'
                }
            })
            
        except stripe.error.StripeError as e:
            return Response({'error': f'Payment failed: {str(e)}'}, status=400)
            
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe_plan(request, plan_id):
    try:
        plan = get_object_or_404(PaymentPlan, id=plan_id)
        user = request.user
        
        # Check for existing active subscription
        existing_sub = Subscription.objects.filter(
            user=user, 
            plan=plan, 
            status='active'
        ).first()
        
        if existing_sub:
            return Response({'error': 'Already subscribed to this plan'}, status=400)
        
        # Create Stripe subscription
        try:
            # Create customer if doesn't exist
            if not hasattr(user, 'stripe_customer_id') or not user.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=f"{user.first_name} {user.last_name}"
                )
                user.stripe_customer_id = customer.id
                user.save()
            
            # Create subscription intent
            intent = stripe.PaymentIntent.create(
                amount=int(plan.price * 100),
                currency='inr',
                metadata={
                    'plan_id': plan_id,
                    'user_id': user.id,
                    'type': 'subscription'
                }
            )
            
            # Create subscription record
            subscription = Subscription.objects.create(
                user=user,
                plan=plan,
                status='pending',
                stripe_subscription_id=intent.id
            )
            
            return Response({
                'client_secret': intent.client_secret,
                'subscription_id': subscription.id,
                'plan_name': plan.name,
                'amount': str(plan.price)
            })
            
        except stripe.error.StripeError as e:
            return Response({'error': f'Subscription failed: {str(e)}'}, status=400)
            
    except PaymentPlan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=404)

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        # Verify webhook signature (use your webhook secret)
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        try:
            # Find the transaction
            transaction = Transaction.objects.get(
                stripe_payment_intent_id=payment_intent['id']
            )
            transaction.status = 'completed'
            transaction.save()
            
            # If it's a course purchase, enroll the user
            if transaction.transaction_type == 'course_purchase':
                from courses.models import Enrollment
                course = Course.objects.get(id=transaction.course_id)
                
                # Create enrollment
                enrollment, created = Enrollment.objects.get_or_create(
                    student=transaction.user,
                    course=course,
                    defaults={
                        'enrolled_at': timezone.now(),
                        'is_active': True
                    }
                )
                
        except Transaction.DoesNotExist:
            pass
    
    elif event['type'] == 'invoice.payment_succeeded':
        # Handle subscription payments
        invoice = event['data']['object']
        subscription_id = invoice['subscription']
        
        try:
            subscription = Subscription.objects.get(
                stripe_subscription_id=subscription_id
            )
            subscription.status = 'active'
            subscription.save()
        except Subscription.DoesNotExist:
            pass
    
    return HttpResponse("OK")

@api_view(['POST'])
def paypal_webhook(request):
    return HttpResponse("OK")

@api_view(['POST'])
def cancel_subscription(request, pk):
    return Response({"message": "Subscription cancellation feature coming soon"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def local_payment_request(request):
    """Handle local Pakistani payment methods"""
    try:
        data = request.data
        payment_method = data.get('payment_method')  # 'easypaisa', 'jazzcash', 'bank_transfer'
        course_id = data.get('course_id')
        amount = data.get('amount')
        user = request.user
        
        if payment_method not in ['easypaisa', 'jazzcash', 'bank_transfer']:
            return Response({'error': 'Invalid payment method'}, status=400)
        
        # Create transaction record
        transaction = Transaction.objects.create(
            user=user,
            amount=amount,
            currency='PKR',
            transaction_type='course_purchase',
            status='pending_verification',
            course_id=course_id,
            payment_method=payment_method
        )
        
        # Generate payment instructions based on method
        instructions = {
            'easypaisa': {
                'method': 'EasyPaisa',
                'account': '03XX-XXXXXXX',
                'steps': [
                    '1. Open EasyPaisa app or dial *786#',
                    '2. Select "Money Transfer"',
                    '3. Enter account: 03XX-XXXXXXX',
                    f'4. Send amount: PKR {amount}',
                    f'5. Note transaction ID and send screenshot to admin'
                ]
            },
            'jazzcash': {
                'method': 'JazzCash',
                'account': '03XX-XXXXXXX',
                'steps': [
                    '1. Open JazzCash app or dial *786#',
                    '2. Select "Money Transfer"',
                    '3. Enter account: 03XX-XXXXXXX',
                    f'4. Send amount: PKR {amount}',
                    f'5. Note transaction ID and send screenshot to admin'
                ]
            },
            'bank_transfer': {
                'method': 'Bank Transfer',
                'account_details': {
                    'bank': 'Naikoria Tech Academy',
                    'account_name': 'Your Business Account',
                    'account_number': 'XXXX-XXXX-XXXX',
                    'iban': 'PKXX-XXXX-XXXX-XXXX-XXXX-XXXX'
                },
                'steps': [
                    '1. Visit your bank or use mobile banking',
                    '2. Transfer to the above account details',
                    f'3. Amount: PKR {amount}',
                    f'4. Reference: {transaction.id}',
                    '5. Send transfer receipt to admin for verification'
                ]
            }
        }
        
        return Response({
            'transaction_id': transaction.id,
            'payment_instructions': instructions[payment_method],
            'verification_note': 'Your enrollment will be activated within 24 hours after payment verification',
            'contact': 'support@naikoria.com for any payment queries'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)
