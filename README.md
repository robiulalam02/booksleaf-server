🛠️ BooksLeaf Server
Welcome to the BooksLeaf Server, the backend API for BooksLeaf — a virtual bookshelf platform where users can manage, categorize, and track their reading journey. This server is built using Node.js, Express, and MongoDB, offering RESTful endpoints, user management, and book data operations.

**🚀 Client Site URL**
([https://booksleaf-7a4b5.web.app](https://booksleaf-7a4b5.web.app))
**🚀 Live API Base URL**
([https://books-leaf-server.vercel.app](https://books-leaf-server.vercel.app))

📁 Project Structure
graphql
Copy
Edit
├── server.js              # Main server entry point  
├── routes/                # API route definitions  
├── controllers/           # Route handler logic  
├── models/                # MongoDB schema definitions  
├── middleware/            # Authentication, error handling  
├── utils/                 # Utility functions  
└── .env                   # Environment variables (excluded from Git)
🔐 Environment Variables
Set the following variables in Vercel > Project Settings > Environment Variables or in a local .env file:

Key	Description
PORT	Server port (optional, defaults to 5000)
MONGODB_URI	MongoDB connection string
JWT_SECRET	Secret key for JWT auth (if using JWT)
FIREBASE_API_KEY	Firebase project API key (if using Firebase)

✨ Features
🔒 Firebase/JWT-based user authentication

📚 Create, update, and delete books

📂 Organize books by categories

📈 Fetch category-wise statistics

🛡️ Protected routes for user-specific content

🧼 Clean, modular, and scalable codebase

📦 Technologies Used
Node.js

Express.js

MongoDB & Mongoose

Firebase Auth or JWT

CORS

dotenv

📮 API Endpoints Overview
📘 Book Routes
Method	Endpoint	Description
GET	/books	Get all books
GET	/books/:id	Get a single book by ID
GET	/books/categories	Get count of books by category
POST	/books	Add a new book
PATCH	/books/:id	Update a book
DELETE	/books/:id	Delete a book

👤 User Routes
Method	Endpoint	Description
POST	/users	Register or update a user
GET	/users	Get all users

🔐 Protected Routes
All routes that involve personal book data or user actions are protected.
Include your token in the request header:

makefile
Copy
Edit
Authorization: Bearer <your_token>
📊 Book Category Analytics
Automatically computes and returns book counts by category

Enables filtering by query params: /books?category=Science

🧪 Development & Testing
Use tools like Postman or Thunder Client for endpoint testing

Make sure MongoDB and Firebase (if used) are properly configured

Token-based auth required for protected endpoints

📝 License
This project is for educational and portfolio use. All rights reserved by the developer.

👨‍💻 Developer
MD. Robiul Alam
MERN Stack Developer