# FlexGym Management System

A full-stack Gym Management System built using React.js, Node.js, Express.js, and MySQL.

This project was developed as a university database system project to demonstrate:
- Database Design (ERD & Normalization)
- SQL Implementation
- Full CRUD Operations
- REST API Development
- Frontend & Backend Integration
- Real Database Connectivity

---

# Features

✔ Member Management  
✔ Membership Plans  
✔ Subscriptions  
✔ Trainers Management  
✔ Class Scheduling  
✔ Attendance Tracking  
✔ Real MySQL Database  
✔ Full CRUD Operations  
✔ REST API Backend  
✔ Responsive React UI  

---

# Technologies Used

| Frontend | Backend | Database |
|---|---|---|
| React.js | Node.js | MySQL |
| TypeScript | Express.js | phpMyAdmin |
| Vite | REST API | XAMPP |
| Tailwind CSS | Axios | |
| TanStack Router | dotenv | |
| Lucide React | cors | |
| react-phone-input-2 | mysql2 | |

---

# Project Structure

```text
project/
│
├── server/        # Express Backend
│
└── README.md

# Dependencies Installation

## Frontend Dependencies

Install all frontend dependencies:

```bash
cd client

npm install react react-dom

npm install typescript vite

npm install @tanstack/react-router

npm install axios

npm install tailwindcss

npm install lucide-react

npm install react-phone-input-2

## BackEnd Dependencies
cd server

npm install express

npm install mysql2

npm install cors

npm install dotenv

npm install nodemon

# Database Import Guide

The project database has already been exported as:

```text
gym-management.sql

install xampp and activate apache and mysql
Go to http://localhost/phpmyadmin
click new database and put the same name as file gym-management
after creating import the file gym-management.sql and all done

Create .env in the backend folder and put this to connect the database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gym-management
PORT=5000