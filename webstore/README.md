-- WebStore – RESTful Web Services & Applications Project

Author: Leunora Seferi
Course: Web Services & Applications (SEEU)

WebStore is a complete e-commerce backend and frontend system built using Next.js (App Router) and PostgreSQL. It includes secure authentication, role-based authorization, product management, orders, discounts, real-time stock calculations, and sales reporting.

--Key Features

Authentication & Security
The project uses JWT-based login, password hashing, and role-based access control. Users are assigned one of three roles: admin, advanced_user, or simple_user. Each role has different permissions.

Product Management
You can create, update, delete, and search products. Products contain detailed attributes such as category, brand, size, color, gender, price, and quantity. The system also supports scheduled discounts and calculates stock in real time based on ordered quantities.

Orders System
Users can place multi-item orders. Each order includes pricing details, quantities, and follows a clear status workflow (Pending → Completed). All order items are stored separately for accuracy.

Reports
The system generates daily earnings, monthly summaries, and identifies top-selling products using aggregated SQL queries.

REST API
Over 40 endpoints are implemented following REST principles. All endpoints accept JSON input and return JSON output. Role-based access prevents unauthorized operations.

-- System Architecture

The application uses Next.js App Router. All backend API routes are inside /app/api/, and all frontend pages are inside /app/.
This setup allows the backend and frontend to work together inside one project.

PostgreSQL is used as the primary database. The system uses a fully normalized relational schema, including tables for users, roles, products, clients, orders, order_items, categories, brands, sizes, colors, gender, discounts, and reports.

-- Database Overview

The database contains 13 tables that store all information required to run an e-commerce platform.
Lookup tables are used for categories, brands, sizes, colors, and gender.
Core business tables include products, orders, and order_items.
Authentication data is stored in users and roles.
The discounts table handles active and scheduled promotions.
The reports table stores computed analytics.

Foreign key relationships ensure data consistency, prevent duplicate values, and guarantee clean relational structure.

-- API Overview (Short Explanation)

Authentication
The login endpoint returns a JWT token which must be provided for all protected routes.

Products API
Includes routes for listing products, viewing a single product, creating products, updating them, deleting them, and calculating stock. Search filters allow filtering by gender, brand, size, availability, price, and more.

Orders API
Users can place new orders, view their orders, and admins can update order status.

Reports API
There are endpoints for daily revenue, monthly revenue, and top-selling products.

All API routes include validation and error handling.

-- Setup Instructions

1. Clone the Repository
Use Git to clone the project from GitHub.

2. Enter the Project Folder
Open the webstore directory.

3. Install All Required Packages
Run npm install to download dependencies.

4. Create the Environment File
Add .env.local at the root /webstore folder and include:

your PostgreSQL database URL

your JWT secret key

5. Import the SQL Schema
Open pgAdmin and import all provided SQL files to build and populate the database.

6. Start the Development Server
Run npm run dev.
The application will be available at http://localhost:3000.

-- Postman Testing

All endpoints in the project were tested using Postman.
This includes:
login
permissions (admin, advanced_user, simple_user)
product CRUD
stock calculation
discounts
order creation
reporting
advanced filtering
Testing verified that each endpoint works correctly and respects security rules.

--Troubleshooting (Explained in Sentences)

If the database does not connect, check the database URL and ensure PostgreSQL is running.
If JWT tokens fail, log in again to generate a new token.
If products fail to create, ensure that category, brand, size, and color IDs exist in lookup tables.
If no seed data appears, re-run the SQL files.
If orders fail to save, check that client_id is included in the request and that the user has the simple_user role.