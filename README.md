# Task Management System

## Project Overview

This Task Management System is a full-stack web application designed by me, Gourav Kumar Upadhyay for the purpose of my Interview task with the Psiborg Technologies and this project is to help teams organize, track, and manage their tasks efficiently. It provides a robust backend API built with Node.js and Express, and a modern, responsive frontend using React, Material-UI, and Vite.

### Key Features

- User Authentication and Authorization
- Role-based Access Control (Admin, Manager, User)
- Task Creation, Assignment, and Management
- User Profile Management
- Task Statistics and Reporting
- Email Notifications for Task Updates and User Registration

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Nodemailer for email functionality

### Frontend
- React.js
- Material-UI (MUI) for UI components
- Vite for fast development and optimized builds
- Axios for API requests
- React Router for navigation

## Repository Structure
https://github.com/Poi5eN/Psiborg


## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- Git

### Backend Setup

1. Clone the repository:
git clone https://github.com/Poi5eN/psiborgbackend.git
cd task-management-system/backend

2. Install dependencies:
npm install


3. Create a `.env` file in the backend directory with the following variables:
PORT=5000
MONGODB_URI=
JWT_SECRET=
SMTP_MAIL=
SMTP_PASSWORD=
FRONTEND_URL=


4. Start the backend server:
npm start
The backend server will start running on `http://localhost:5000`.


### Frontend Setup

1. Navigate to the frontend directory:
git clone https://github.com/Poi5eN/Psiborg.git


2. Install dependencies:
npm install


3. Start the development server:
npm run dev

The frontend development server will start, typically on `http://localhost:3000`.


## API Documentation

For detailed API documentation, please refer to the `openapi.yaml` file in the `psiborg` directory. You can view this file using Swagger UI or any other OpenAPI-compatible tool.


## Testing

To run the backend tests:
cd backend
npm test

To run the frontend tests:
cd frontend
npm test


## Deployment

### Backend Deployment
Deployed on render for the backend service

### Frontend Deployment
Deployed on Netlify with the url: https://psiborg.netlify.app/


Thank you for making your time and checking my task to the Task Management System :)
