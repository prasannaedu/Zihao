from django.shortcuts import render,redirect
from .models import *
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required 
from django.contrib.auth.decorators import permission_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated ,IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt  # Exempt from CSRF since JWT doesn't rely on cookies
@csrf_exempt  # Exempt from CSRF since JWT doesn't rely on cookies
def login_page(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': f'Welcome, {user.username}!',
            })
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)

    return JsonResponse({'error': 'GET method not allowed'}, status=405)
def log_in(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        # print(username)
        
        if not User.objects.filter(username=username).exists():
           
            return redirect('/login/')  
        
        user = authenticate(username=username, password=password)
        
        if user is None:
           
            return redirect('/login/')  
        print(f"Authenticated user: {user.username}")
        login(request, user)
        return redirect('/receipes/')  
    return render(request, 'login.html')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def receipes(request):
    if request.method == 'GET':
        queryset = Receipe.objects.all()
        return Response({'receipes': list(queryset.values())})
    
@api_view(['POST'])
# @permission_classes([IsAuthenticated, IsAdminUser])
def create_receipe(request):
    user = request.user
    data = request.data

    receipe_name = data.get('receipe_name')
    receipe_description = data.get('receipe_description')
    recipe_price = data.get('recipe_price')
    receipe_image = request.FILES.get('receipe_image')# to keep it as optional 

    if not receipe_name or not receipe_description:
        return Response({'error': 'All fields are required'}, status=400)

    receipe = Receipe.objects.create(
        user=user,
        receipe_name=receipe_name,
        receipe_description=receipe_description,
        recipe_price=recipe_price,
        receipe_image=receipe_image,
    )
    receipe.save()
    return Response({'message': 'Receipe created successfully', 'id': receipe.id}, status=201)

# def receipes(request):                                  
#     if request.method == "POST":
#     # Access form data
#         receipe_name = request.POST.get('receipe_name')
#         receipe_description = request.POST.get('receipe_description')
    
#     # Access file data
#         receipe_image = request.FILES.get('receipe_image')
#         print(receipe_name)
    
#     # Debug print statements
#     # print(receipe_name)
#     # print(receipe_description)
#     # print(receipe_image)
    
#     # Create a new Receipe object
#         Receipe.objects.create(
#             receipe_name=receipe_name,
#             receipe_description=receipe_description,
#             receipe_image=receipe_image,
#         )
        
#         # Redirect to the list of recipes
#         return redirect('/receipes/')

    # queryset = Receipe.objects.all()
    # print(queryset)
    # context = {'receipes': queryset}
    # #to return list of receipes we user following code
    # return JsonResponse({'receipes': list(queryset.values())})

    # return render(request, 'receipes.html', context)
# @api_view(['POST'])
# @permission_classes([IsAuthenticated, IsAdminUser])
# def update_receipe(request,id):
#     queryset = Receipe.objects.get(id =id)
#     if request.method == "POST":
#         data = request.POST
#         receipe_image =request.FILES.get('receipe_image')
#         receipe_name =data.get('receipe_name')
#         receipe_description = data.get('receipe_description')
#         queryset.receipe_image = receipe_image
#         queryset.receipe_name =receipe_name 
#         queryset.receipe_description  =receipe_description

#         if receipe_image:
#             queryset.receipe_image = receipe_image
#         queryset.save()
#         return redirect("/receipes/") 
#     context = {'receipe':queryset}
#     return render(request, 'update.html',context)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_receipe(request, id):
    try:
        recipe = Receipe.objects.get(id=id)
    except Receipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=404)

    if request.method == 'GET':
        # Return recipe data for frontend
        recipe_data = {
            'recipe_name': recipe.receipe_name,
            'recipe_description': recipe.receipe_description,
            'recipe_price': recipe.recipe_price,
            'recipe_image': recipe.receipe_image.url if recipe.receipe_image else None,
        }
        return Response(recipe_data)

    elif request.method == 'PUT':
        # Handle updating recipe data
        data = request.data  # Use .data for JSON payloads
        receipe_image = request.FILES.get('receipe_image')

        recipe.receipe_name = data.get('recipe_name', recipe.receipe_name)
        recipe.receipe_description = data.get('recipe_description', recipe.receipe_description)
        recipe.recipe_price=data.get('recipe_price',recipe.recipe_price)
        if receipe_image:
            recipe.receipe_image = receipe_image
        recipe.save()

        updated_recipe = {
            'id': recipe.id,
            'recipe_name': recipe.receipe_name,
            'recipe_description': recipe.receipe_description,
            'recipe_price': recipe.recipe_price,
            'recipe_image': recipe.receipe_image.url if recipe.receipe_image else None,
            
        }
        return Response({'message': 'Recipe updated successfully', 'recipe': updated_recipe}, status=200)



# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated, IsAdminUser])
# def delete_receipe(request,id):
#     queryset = Receipe.objects.get(id =id)
#     queryset.delete()
#     return redirect("/recipes")

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_receipe(request, id):
    try:
        queryset = Receipe.objects.get(id=id)
        queryset.delete()
        return Response({'message': 'Recipe deleted successfully!'}, status=200)
    except Receipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=404)


def login_page(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        # print(username)
        
        if not User.objects.filter(username=username).exists():
           
            return redirect('/login/')  
        
        user = authenticate(username=username, password=password)
        
        if user is None:
           
            return redirect('/login/')  
        print(f"Authenticated user: {user.username}")
        login(request, user)
        return redirect('/receipes/')  
    
    return render(request, 'login.html')

@csrf_exempt
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
    # return Response({'message': 'This is a protected endpoint!','is_admin': 'true'})
    is_admin = request.user.is_staff  # Check if the user is an admin
    return Response({'is_admin': is_admin})

response=Response

def logout_page(request):
    logout(request)
    return redirect('/login/') 

