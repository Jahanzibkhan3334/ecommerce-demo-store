# Pure Wear - React & Laravel E-Commerce Project

This is a full-stack e-commerce project built with React (Vite) on the frontend and Laravel 11 on the backend.

## Prerequisites

To run this project on a new computer, you must have the following software installed:

1. **XAMPP** (or any local server with PHP 8.2+ and MySQL)
2. **Composer** (PHP dependency manager)
3. **Node.js** (v18+ recommended)
4. **Git** (optional, if you are cloning the repository)

---

## Step-by-Step Setup Guide

### 1. Database Setup
1. Open XAMPP and start **Apache** and **MySQL**.
2. Open your browser and go to `http://localhost/phpmyadmin`.
3. Click on **New** to create a new database.
4. Name the database exactly: `ecommerce_react_laravel` and click **Create**.

### 2. Backend Setup (Laravel)
1. Open your terminal (Command Prompt or PowerShell) and navigate to the backend folder:
   ```bash
   cd "C:\xampp\htdocs\final year project\backend"
   ```
2. Install PHP dependencies via Composer:
   ```bash
   composer install
   ```
3. Create a copy of the `.env.example` file and rename it to `.env`. (If `.env` already exists, skip this step).
4. Generate a new application key:
   ```bash
   php artisan key:generate
   ```
5. Run the database migrations and seed the initial data (products, categories, etc.):
   ```bash
   php artisan migrate:fresh --seed
   ```
6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *Note: Keep this terminal window open. The backend will run on `http://localhost:8000`.*

### 3. Frontend Setup (React/Vite)
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd "C:\xampp\htdocs\final year project\frontend"
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   *Note: The frontend will typically run on `http://localhost:5173`. Click the link provided in the terminal to view the application.*

---

## Default Accounts

If you seeded the database using the instructions above, the following accounts are available for testing:

**Admin Account:**
- **Email:** admin@example.com
- **Password:** admin123

**Customer Account:**
- **Email:** test@example.com
- **Password:** password

*(Note: You can always create a new admin account using Laravel Tinker if needed).*
