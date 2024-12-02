from django.shortcuts import render,redirect
from .models import *
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required 
from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
import json
from rest_framework.request import Request

# Login with JWT token response
# @csrf_exempt 
# @api_view(['POST','GET'])
@api_view(['POST','GET'])
def login_page(request: Request):  # DRF request
    if request.method == 'GET':
        # When the method is GET, render the login.html template
        return render(request, 'login.html')
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': f'Welcome, {user.username}!',
            })
        return Response({'error': 'Invalid credentials'}, status=401)
# @api_view(['GET'])
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    return JsonResponse({'error': 'Invalid credentials'}, status=401)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
def receipes(request):
    if request.headers.get('Accept') == 'application/json':  # Handle API requests
        queryset = Receipe.objects.all()
        return Response({'receipes': list(queryset.values())})
    else:  # Handle frontend rendering
        return render(request, 'receipes.html')
    

# @api_view(['POST'])
# @permission_classes([IsAuthenticated, IsAdminUser])
def create_receipe(request:Request):
    user = request.user
    data = request.data

    receipe_name = data.get('receipe_name')
    receipe_description = data.get('receipe_description')
    receipe_image = request.FILES.get('receipe_image')

    if not receipe_name or not receipe_description:
        return Response({'error': 'All fields are required'}, status=400)

    receipe = Receipe.objects.create(
        user=user,
        receipe_name=receipe_name,
        receipe_description=receipe_description,
        receipe_image=receipe_image,
    )
    receipe.save()
    return Response({'message': 'Receipe created successfully', 'id': receipe.id}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_receipe(request, id):
    receipe = Receipe.objects.get(id=id)

    data = request.data
    receipe_name = data.get('receipe_name')
    receipe_description = data.get('receipe_description')
    receipe_image = request.FILES.get('receipe_image')

    if receipe_name:
        receipe.receipe_name = receipe_name
    if receipe_description:
        receipe.receipe_description = receipe_description
    if receipe_image:
        receipe.receipe_image = receipe_image

    receipe.save()
    return Response({'message': 'Receipe updated successfully'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_receipe(request, id):
    receipe = Receipe.objects.get(id=id)
    receipe.delete()
    return Response({'message': 'Receipe deleted successfully'})




@csrf_exempt #this is used to exempt csrf token, i.e to disable csrf token
def register(request):
    if request.method == 'GET':
        # Render the register.html template for GET requests
        return render(request, 'register.html')

    elif request.method == 'POST':
        if request.content_type == 'application/json':
            # Handle JSON payload (API)
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
        else:
            # Handle form submission (HTML form)
            data = request.POST

        # Extract form fields
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        username = data.get('username')
        password = data.get('password')

        # Validate form fields
        if not all([first_name, last_name, username, password]):
            return JsonResponse({'error': 'All fields are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        # Create and save the user
        user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            username=username
        )
        user.set_password(password)
        user.save()
        if request.content_type != 'application/json':
            return redirect('login')
        # Optional: Return JWT tokens for API
        if request.content_type == 'application/json':
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'User registered successfully',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=200)

        # For form submissions, redirect to login page or success page
        # return JsonResponse({'message': 'User registered successfully'}, status=200)
        #to redirect to login page with 
        # return redirect('/login/')

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'This is a protected endpoint!'})

response=Response

def logout_page(request):
    logout(request)
    return redirect('/login/') 

