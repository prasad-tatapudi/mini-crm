# Mini CRM Application

A full-stack simple CRM application designed to manage client leads generated from website contact forms. Built with React (Vite), Node.js, Express, and MongoDB.

## Features

- **Lead Listing**: View all leads including name, email, source, and status.
- **Lead Status Updates**: Change lead status (New, Contacted, Converted, Lost).
- **Notes and Follow-ups**: Add timestamped notes for each lead to keep track of interactions.
- **Secure Admin Access**: JWT-based authentication for admin users to securely manage leads.
- **RESTful API**: Backend API to create new leads (public) and manage leads (protected).

## Technology Stack

- **Frontend**: React.js (Vite), React Router, Axios, CSS (Modern UI)
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs
- **Database**: MongoDB (Mongoose)

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally on default port 27017

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Initial Admin Setup
To use the CRM, you need an admin account. You can create the initial admin user by making a POST request to the API:

```bash
curl -X POST http://localhost:5000/api/auth/setup
```

This will create an admin with:
- **Username:** admin
- **Password:** password123

You can then log in to the CRM UI using these credentials.

## Adding a Test Lead
To simulate a website form submission creating a new lead:

```bash
curl -X POST http://localhost:5000/api/leads \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john@example.com", "source": "Website"}'
```
