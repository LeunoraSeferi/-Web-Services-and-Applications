📚 Online Library System
Microservices with Docker & Independent Databases
 	 Project Overview

This project implements a simple Online Library System using a microservices architecture. Each microservice is deployed in its own Docker container and connected to an independent database, ensuring full isolation, scalability, and interoperability.
The system consists of three independent microservices:
•	Catalog Service – manages book information
•	User Service – manages user profiles
•	Order Service – manages book orders
Docker Compose is used to orchestrate all services, databases, networks, and volumes, enabling easy deployment and management of the system.

 	Architecture Overview
The application follows a microservices-based architecture, where each service is autonomous and independently deployable.
Each service:
•	Runs in its own Docker container
•	Uses its own dedicated database container
•	Communicates via RESTful APIs
A common Docker network named library-net is used to allow communication between services and their respective databases. Persistent data storage is ensured through Docker volumes.

 	Technologies Used
1. Catalog Service
Language: Python
Framework: Flask
Database: PostgreSQL
Responsibility: Manage books
Base API: /catalog

2. User Service
Language: Python
Framework: Flask
Database: MySQL
Responsibility: Manage user profiles
Base API: /users

3. Order Service
Language: Node.js
Framework: Express.js
Database: MySQL
Responsibility: Manage orders
Base API: /orders

 	Project Structure
ASS.2/
│
├── catalog-service/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── user-service/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── order-service/
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md

 	 Environment Configuration
Each microservice connects to its own database using environment variables, ensuring proper separation and secure configuration.
Common Environment Variables:
•	DB_HOST – database container name
•	DB_NAME – database name
•	DB_USER – database user
•	DB_PASS – database password
All environment variables are defined directly in the docker-compose.yml file.

 	Docker Compose Setup
Docker Compose is used to:
•	Build and run all microservices
•	Create and connect database containers
•	Define a shared network (library-net)
•	Configure persistent storage using Docker volumes

Run the project:
docker-compose up --build -d

Stop the project:
docker-compose down



 	CRUD Functionality
All microservices implement full CRUD functionality (Create, Read, Update, Delete).
According to the assignment requirements, the READ operation is mandatory for the initial submission. This requirement is fully satisfied for all services through the following endpoints:
•	GET /catalog/books
•	GET /users
•	GET /orders
Each endpoint was tested successfully and returns valid JSON responses.

 	Testing
Testing was performed using Postman by sending HTTP requests to each microservice.
The testing process verified that:
•	Each service is reachable via its exposed port
•	Each service communicates independently with its own database
•	CRUD operations function correctly
•	READ operations return valid JSON responses, including empty arrays when no records exist

 	Service Endpoints
	Catalog Service (Books)
The Catalog Service manages book information and is accessible through the base URL http://localhost:5001
. The service exposes RESTful endpoints under the /catalog/books path. A POST request to /catalog/books creates a new book record. The mandatory READ functionality is implemented using a GET request to /catalog/books, which retrieves all books stored in the PostgreSQL database. Individual books can be retrieved using GET /catalog/books/{id}. Existing book records can be updated using PUT /catalog/books/{id}, and removed using DELETE /catalog/books/{id}.

	User Service (Users)
The User Service manages user profiles and is available at http://localhost:5002
. All user-related operations are exposed under the /users endpoint. New users are created using POST /users. The mandatory READ operation is provided by GET /users, which returns all user profiles in JSON format. Individual users can be retrieved using GET /users/{id}, updated using PUT /users/{id}, and deleted using DELETE /users/{id}.

	Order Service (Orders)
The Order Service is responsible for managing book orders and is accessible via http://localhost:5003
. The service exposes endpoints under /orders. New orders are created using POST /orders. The mandatory READ functionality is implemented through GET /orders, which retrieves all existing orders. Individual orders can be accessed using GET /orders/{id}, updated using PUT /orders/{id}, and deleted using DELETE /orders/{id}.

 	Conclusion
This project successfully demonstrates the implementation of a Docker-based microservices architecture with independent databases and RESTful APIs. All assignment requirements were fully implemented, tested, and documented. The system is modular, scalable, and compliant with the specifications of the Web Services and Applications course.
