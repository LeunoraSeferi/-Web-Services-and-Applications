WebStore – RESTful Web Services & Applications Project
This project is an e-commerce WebStore backend built with Next.js (App Router) and PostgreSQL.
It exposes a set of RESTful APIs for:
•	Product management (CRUD, search, real-time stock, discounts)
•	Order processing and order status updates
•	User management with roles (admin, advanced_user, simple_user)
•	Authentication with JWT tokens
•	Sales reports (daily, monthly, top-selling products)
The project is designed for the *Web Services & Applications* course and follows the assignment requirements:  
**RESTful APIs + database design + security + reports + Postman tests + documentation**.
TECH STACK:
•	Backend Framework: Next.js (Node.js, App Router, /app/api)
•	Database: PostgreSQL (pgAdmin4)
•	Authentication: JWT (JSON Web Token)
•	Security Features:
o	Password hashing using PostgreSQL crypt()
o	Role-Based Access Control (RBAC)
•	Testing: Postman



 SETUP INSTRUCTIONS:
1️.Clone the Repository
git clone https://github.com/LeunoraSeferi/-Web-Services-and-Applications.git
2️.Navigate to the Project
cd webstore
3️.Install Dependencies
npm install
4️. Create Environment File
Create .env.local:
DATABASE_URL=postgresql://user:password@localhost:5432/webstore
JWT_SECRET=your_secret_key_here
5️.Run Database SQL Scripts
Import the SQL files using pgAdmin4:
•	clients.sql
•	clientsorders.sql
•	productstable.sql
•	discounts.sql
•	insert.sql
•	pass.sql
•	report.sql
•	tables.sql
•	webstoredb.sql
6️. Start the Development Server
npm run dev


 TESTING:
All API endpoints were fully tested using Postman, including:
•	Authentication (login)
•	Role-protected routes
•	CRUD for products
•	Discounts
•	Orders
•	Reports
•	Advanced product search
CODE QUALITY HIGHLIGHTS:
✔ Clean and well-organized folder structure
✔ Authentication isolated in /lib/auth.js
✔ Database connection isolated in /lib/db.js
✔ APIs grouped by module
✔ Comments included in all major files
✔ Security considerations applied throughout


 ACADEMIC REQUIREMENTS FULFILLED:
This project fully satisfies all major requirements of the Web Services & Applications course:
•	Database design
•	 RESTful API development
•	Authentication (JWT)
•	RBAC (admin, advanced_user, simple_user)
•	 Advanced search
•	 Real-time stock management
•	Sales reporting
•	Postman testing
•	 Clean code standards
•	 Full documentation
•	 GitHub submission

