# Zihao
使用 Django 和 React 的酒店菜单仪表板

The **Zihao-Recipe Management System** is a full-stack web application designed to help users manage their recipes efficiently. Users can add, update, view, and delete recipes with details like recipe name, description, price, and an optional image. The application ensures security through user authentication and authorization using JWT tokens and provides role-based access control. Developed using **Django** and **ReactJS**, the system incorporates a RESTful API for seamless communication between the backend and frontend. This project demonstrates best practices in modern web development, including password hashing for secure storage, secure API interactions, and a dynamic, user-friendly interface.

---

## Technologies Used
### Frontend
- **ReactJS**
- **JavaScript (ES6+)**
- **HTML5** and **CSS3**
- **Bootstrap 5**

### Backend
- **Django** (Python)
- **Django REST Framework (DRF)**
- **SQLite** (default database, replaceable with PostgreSQL/MySQL)

### Security and Authentication
- **JWT (JSON Web Tokens)**
- **Password Hashing** (Django’s `pbkdf2_sha256`)

---

## Features
- Admin can add recipes, edit and delete the recipe details in Menu board
- Users can view the List of recipes lists along with their details

---


## Setup Instructions
### Prerequisites
- Python 3.9+ installed
- Node.js 16+ and npm installed
- SQLite (default) or any preferred database system

### Backend Setup
1. Create a python environment(Recommended)
    ```bash
    python -m venv myenv
    ```
2. Clone the repository:
   ```bash
   git clone https://github.com/prasannaedu/Zihao.git
   ```
3. Navigate to Backend and install required libraries and frameworks
    ```bash
    pip install pip install djangorestframework djangorestframework-simplejwt django-cors-headers pillow
    ```
### Frontend Setup
1. Navigate to frontend folder and install required libraries
    ```bash
    npm install axios react-router-dom jwt-decode bootstrap
    ```

2. Start server
    ```bash
    npm start
    ```
## Usage Instructions 
- Navigate to Backend folder and create superuser for Admin user
    ```bash
    python manage.py createsuperuser
    ```
- Make migrations and apply migrations
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
- Once you start both the servers you will be directed to Loginpage then Enter your admin credentials.(since we are at begining add recipes by logging in as Admin) or Click register and Create your account by filling form
- If you go to Registration you will be redirected to login page, after entering your credentials you will be able to see the menu dashboard
- If you login as admin you will be directed to same Menu dashboard with additional buttons of edit, delete with recipes, normal user wont have permsission to see and use these buttons when they login with their credentials
- When you click update you will get a form to update any information of choosen recipe 
- You can logout by pressing Logout button on the Top right corner in Navbar 
