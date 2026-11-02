
# MERN Practice Project

A basic MERN development environment with React (Vite)
as the frontend and Node.js + Express as the backend.

## Technologies Used

- React.js
- Vite
- Node.js
- Express.js
- Axios
- CORS
- dotenv
- Nodemon
- Git

## Project Structure

mern-practice/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

## Installation

### 1. Clone the repository

git clone YOUR_REPOSITORY_URL

cd mern-practice

### 2. Install Backend Dependencies

cd server

npm install

### 3. Configure Environment Variables

Create a .env file inside server:

PORT=5001

### 4. Start Backend

npm run dev

Backend URL:
http://localhost:5001

### 5. Install Frontend Dependencies

Open another terminal:

cd client

npm install

### 6. Start Frontend

npm run dev

Frontend URL:
http://localhost:5173

## API Endpoint

GET /api

Returns a welcome message from the Express backend.

## Features

- React frontend using Vite
- Express backend
- Axios API integration
- Vite proxy configuration
- Environment variable configuration
- Separate client and server folders

## Developer

Kalpesh Patil
