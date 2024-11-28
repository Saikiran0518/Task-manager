# Task Management System

## Objective
Develop a simple **Task Management System** that allows users to create, view, update, and delete tasks. The system focuses on core CRUD (Create, Read, Update, Delete) operations, usability, and efficient code structure.

## Features
- **Create a task**: Add a new task with a title, description, due date, and status.
- **View tasks**: List all tasks with their details.
- **Update a task**: Edit an existing task and toggle its status between **Pending** and **Completed**.
- **Delete a task**: Remove a task from the database.
- **Filter tasks by status**: View tasks filtered by their current status (Pending or Completed).
- **Cross-Origin Resource Sharing (CORS)**: Enabled for all routes to allow communication between the frontend and backend.

## Tech Stack
- **Backend**: Flask (Python)
- **Database**: SQLite (via SQLAlchemy ORM)
- **Frontend**: HTML, CSS, JavaScript (for minimal UI)
- **CORS**: Flask-CORS for frontend-backend communication
