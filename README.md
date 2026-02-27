# YCSoft Rwanda - Sales Management System

## Project Description

YCSoft Rwanda is a comprehensive **Sales Management System** designed to streamline inventory and sales operations. This full-stack web application enables businesses to manage products, record sales transactions, generate reports, and monitor dashboard analytics in real-time.

### Key Features

- **User Authentication**: Secure user registration and login with JWT-based authentication
- **Role-Based Access Control**: Different permission levels for Admin and Cashier roles
- **Product Management**: Create, read, update, and delete products (Admin only)
- **Sales Recording**: Record sales transactions with real-time tracking
- **Sales Reports**: Generate and view detailed sales reports
- **Dashboard Analytics**: Visual dashboard with key business metrics
- **Responsive UI**: Modern, user-friendly interface built with React and TailwindCSS

---

## Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd YCSoft Rwanda
```

#### 2. Setup the Server

```bash
cd server

# Install dependencies
npm install

# Create a .env file in the server directory
# Copy the following and update with your values:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ycsoft-rwanda
JWT_SECRET=your_jwt_secret_key_here

# Start the development server
npm run dev
```

The server will run on `http://localhost:5000`

#### 3. Setup the Client

```bash
cd ../client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The client will typically run on `http://localhost:5173`

#### 4. Build for Production

**Client:**
```bash
cd client
npm run build
```

**Server:** (Server is already in production-ready format)

---

## Folder Structure Explanation

### Root Directory
```
├── client/              # Frontend application (React + Vite)
├── server/              # Backend application (Node.js + Express)
└── README.md            # Project documentation
```

### Client Folder Structure (`/client`)

```
client/
├── src/
│   ├── assets/          # Static assets (images, icons, etc.)
│   ├── components/      # Reusable React components
│   │   ├── auth/        # Authentication pages (Login, Register)
│   │   ├── Context/     # React Context for global state (AuthContext)
│   │   ├── Dashboard.jsx    # Dashboard page with analytics
│   │   ├── LoadingSpinner.jsx   # Loading indicator component
│   │   ├── Navbar.jsx   # Navigation bar component
│   │   ├── Products.jsx # Products management page
│   │   ├── Report.jsx   # Sales reports page
│   │   └── Sales.jsx    # Sales recording page
│   ├── services/
│   │   └── api.js       # API service for backend communication
│   ├── App.jsx          # Main App component
│   ├── App.css          # App-level styles
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── public/              # Static public assets
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
├── tailwind.config.js   # TailwindCSS configuration
└── index.html           # HTML entry point
```

#### Client Component Breakdown

- **auth/** - Login and Register pages for user authentication
- **Context/AuthContext.jsx** - Global authentication state management
- **Dashboard.jsx** - Displays key business metrics and analytics
- **Products.jsx** - CRUD operations for product inventory
- **Sales.jsx** - Interface for recording new sales
- **Report.jsx** - View sales reports and analytics

### Server Folder Structure (`/server`)

```
server/
├── config/
│   └── db.js            # MongoDB connection configuration
├── Controllers/
│   ├── authController.js    # Authentication logic (register, login)
│   ├── dashboardController.js   # Dashboard metrics logic
│   ├── productController.js     # Product CRUD operations
│   └── salesController.js       # Sales recording logic
├── middleware/
│   ├── authMiddleware.js    # JWT authentication verification
│   └── roleMiddleware.js    # Role-based access control
├── models/
│   ├── Product.js       # Product data model
│   ├── Sale.js          # Sale transaction model
│   └── User.js          # User/authentication model
├── routes/
│   ├── authRoutes.js    # Auth endpoints
│   ├── dashboardRoutes.js   # Dashboard endpoints
│   ├── productRoutes.js     # Product endpoints
│   └── salesRoutes.js       # Sales endpoints
├── server.js            # Main server entry point
├── package.json         # Project dependencies
└── .env                 # Environment variables (not tracked in git)
```

#### Server Components Breakdown

- **Models** - MongoDB schemas for User, Product, and Sale
- **Controllers** - Business logic for handling requests
- **Middleware** - Authentication and authorization checks
- **Routes** - API endpoint definitions

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register a New User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "cashier"  // or "admin"
}
```

**Response:** (200 OK)
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "cashier"
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** (200 OK)
```json
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "cashier"
  }
}
```

### Product Endpoints

#### Get All Products
```
GET /products
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** (200 OK)
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 25.99,
      "quantity": 100,
      "description": "Product description"
    }
  ]
}
```

#### Create Product (Admin Only)
```
POST /products
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "price": 29.99,
  "quantity": 50,
  "description": "Product description"
}
```

**Response:** (201 Created)
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "product_id",
    "name": "New Product",
    "price": 29.99,
    "quantity": 50,
    "description": "Product description"
  }
}
```

#### Update Product (Admin Only)
```
PUT /products/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Product",
  "price": 34.99,
  "quantity": 75
}
```

**Response:** (200 OK)
```json
{
  "message": "Product updated successfully",
  "product": { /* updated product data */ }
}
```

#### Delete Product (Admin Only)
```
DELETE /products/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** (200 OK)
```json
{
  "message": "Product deleted successfully"
}
```

### Sales Endpoints

#### Record a Sale
```
POST /sales
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 5,
  "totalAmount": 129.95,
  "paymentMethod": "cash"  // or "card", "mobile"
}
```

**Response:** (201 Created)
```json
{
  "message": "Sale recorded successfully",
  "sale": {
    "_id": "sale_id",
    "productId": "product_id",
    "quantity": 5,
    "totalAmount": 129.95,
    "paymentMethod": "cash",
    "createdAt": "2026-02-27T10:30:00Z"
  }
}
```

#### Get Sales Report
```
GET /sales
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters (Optional):**
- `startDate` - Filter sales from this date (YYYY-MM-DD)
- `endDate` - Filter sales until this date (YYYY-MM-DD)
- `limit` - Number of records to return (default: 50)
- `page` - Page number for pagination (default: 1)

**Response:** (200 OK)
```json
{
  "sales": [
    {
      "_id": "sale_id",
      "productId": "product_id",
      "quantity": 5,
      "totalAmount": 129.95,
      "paymentMethod": "cash",
      "createdAt": "2026-02-27T10:30:00Z"
    }
  ],
  "total": 150,
  "totalRevenue": 3847.50
}
```

### Dashboard Endpoints

#### Get Dashboard Metrics
```
GET /dashboard
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** (200 OK)
```json
{
  "totalSales": 150,
  "totalRevenue": 3847.50,
  "totalProducts": 25,
  "totalUsers": 8,
  "monthlySales": [
    { "month": "January", "sales": 45, "revenue": 1200 },
    { "month": "February", "sales": 105, "revenue": 2647.50 }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "error_type"
}
```

### Common Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (Invalid data)
- **401** - Unauthorized (Missing or invalid token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Resource not found)
- **500** - Internal Server Error

---

## Technology Stack

### Frontend
- **React 19.2** - UI library
- **Vite 8** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Icons 5.5** - Icon library
- **ESLint** - Code quality tool

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9.2** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs 3.0** - Password hashing
- **Nodemon** - Development auto-reload
- **CORS** - Cross-origin request handling

---

## Environment Variables

### Server (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ycsoft-rwanda
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

---

## Running the Application

### Development Mode

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser to access the application.

### Production Build

**Client:**
```bash
cd client
npm run build
npm run preview
```

---

## Project Status

This project is under active development. Features and APIs are subject to change.

---

## Support

For issues, questions, or contributions, please contact the development team at YCSoft Rwanda.

---

## License

This project is licensed under the ISC License.
