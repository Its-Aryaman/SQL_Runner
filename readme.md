# 🧠 SQL Runner

A full-stack **SQL Runner web application** built with **React (frontend)** and **Flask (backend)** that allows users to execute SQL queries securely and visualize the results in a clean, interactive interface.  

This project demonstrates end-to-end development using modern JavaScript and Python frameworks, authentication with JWT, and dynamic data visualization using Material UI components.

---

## 📚 Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Backend Setup (Flask)](#backend-setup-flask)
  - [Frontend Setup (React)](#frontend-setup-react)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Setup Database](#setup-database)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

---

## 🧩 Introduction
**SQL Runner** is a web-based tool that allows users to:
- Authenticate with a username and password.
- Browse available database tables and view their schema.
- Execute custom SQL queries.
- View results in a dynamic table format.
- Access recently executed queries.

It’s designed as a lightweight web-based SQL client built using **React** and **Flask**.

---

## ✨ Features
✅ JWT-based authentication  
✅ Execute any SQL command (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)  
✅ View available tables and table details  
✅ Display query results in a responsive Material UI table  
✅ Browse table structure and sample rows  
✅ Recent query history  
✅ Clean, modern UI design  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Material UI, Axios |
| **Backend** | Flask, Flask-CORS, PyJWT |
| **Database** | SQLite |
| **Language** | Python 3, JavaScript (ES6+) |

---

## 📂 Project Structure


## Project Structure

```
sql-runner/
│
├── backend/
│ ├── app.py # Flask backend API
│ ├── sql_runner.db # SQLite database
│
├── frontend/
│ ├── src/
│ │ ├── App.js # Main React component
│ │ ├── Login.js # Login component
│ │ ├── index.js # React entry point
│ │ └── ...
│ └── package.json
└──  README.md


```

## ⚙️ Installation

### 🧮 Backend Setup (Flask)
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sql-runner.git
   cd sql-runner/backend

## Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```
## Install dependencies:
```
pip install flask flask-cors pyjwt
```
## Run the backend:

Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
Install dependencies:
```
```
pip install flask flask-cors pyjwt
```
Run the backend:
```
python app.py
```
The backend will start at:
👉 http://127.0.0.1:5000

## 🖥️ Frontend Setup (React)
Open a new terminal and navigate to:
```
cd sql-runner/frontend
```
Install dependencies:
```
npm install
```
Start the frontend:
```
npm start
```
The app will open automatically at:
👉 http://localhost:5174

🚀 Usage
Make sure both servers (Flask + React) are running.

Visit http://localhost:5174 in your browser.

Login using the default credentials:
```
Username: admin
Password: admin
```
Explore the tables, execute SQL queries, and view the results interactively.

🔗 API Endpoints
- **Authentication**:
  - `POST /api/auth/register`: Register a user (`username`, `password`, optional `role`).
  - `POST /api/auth/login`: Login and get JWT token.
Method	Endpoint	Description
POST	/login	Authenticate user and return a JWT token
POST	/run-query	Execute a SQL query
GET	/tables	Retrieve all table names
GET	/table-info/<table_name>	Get column info and sample data for a table
GET	/recent-queries	Fetch recent user queries
⚙️ Configuration
You can customize the following in app.py:

DATABASE = "sql_runner.db"
SECRET_KEY = "my_very_secret_key"
USERNAME = "admin"
PASSWORD = "admin"
⚠️ Security Tip: For production, move these values to environment variables.

🧱 Setup Database
To create a demo SQLite database for testing:

Open a Python shell in the backend folder:

python
Run the following:

import sqlite3
```
conn = sqlite3.connect("sql_runner.db")
c = conn.cursor()
c.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)")
c.execute("INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com')")
c.execute("INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com')")
conn.commit()
conn.close()
Restart your Flask server — the new table will appear in the UI.
```
