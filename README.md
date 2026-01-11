🧠 Habit Tracker – Full Stack Web Application

A full-stack Habit Tracker application built using HTML, CSS, JavaScript, Node.js, Express, MongoDB, and deployed on Netlify (frontend) and Render (backend).

This project demonstrates authentication, CRUD operations, REST APIs, cloud database integration, and real-world deployment.


🚀 Live Demo

Frontend (Netlify):
👉 https://dreamy-mermaid-b6df98.netlify.app/

Backend API (Render):
👉 https://habit-tracker-6odx.onrender.com


🛠️ Tech Stack

Frontend

HTML5

CSS3

Vanilla JavaScript

Netlify (Hosting)


Backend

Node.js

Express.js

MongoDB (Atlas)

Mongoose

JWT Authentication

bcryptjs

Render (Hosting)


📁 Project Structure




habit-tracker/

│

├── frontend/

│   ├── index.html

│   ├── style.css

│   └── script.js

│

├── backend/

│   ├── models/

│   │   ├── User.js

│   │   └── Habit.js

│   ├── server.js

│   ├── package.json

│   ├── package-lock.json

│   └── .env

│

├── .gitignore

└── README.md


✨ Features

🔐 User Authentication (Signup & Login)

🔑 JWT-based Authorization

➕ Add habits

🔁 Toggle habit completion

❌ Delete habits

🔥 Habit streak tracking

💾 Persistent data using MongoDB

🌐 Fully deployed (Frontend + Backend)

🛡️ Secure environment variables

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

> ⚠️ Never commit `.env` files to GitHub


🧪 Run Locally

1️⃣ Clone the repository

git clone https://github.com/athar-04/habit-tracker.git

cd habit-tracker


2️⃣ Start Backend

cd backend

npm install

node server.js


Backend will run on: http://localhost:5000


3️⃣ Open Frontend

Open frontend/index.html in your browser

(or use Live Server extension)


🔗 API Endpoints
| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| POST   | `/signup`     | Register user   |
| POST   | `/login`      | Login user      |
| GET    | `/habits`     | Get user habits |
| POST   | `/habits`     | Add habit       |
| PUT    | `/habits/:id` | Update habit    |
| DELETE | `/habits/:id` | Delete habit    |


🚀 Deployment

Backend (Render)

Root directory: backend

Build command: npm install

Start command: node server.js

Environment variables added in Render dashboard

Frontend (Netlify)

Base directory: frontend

Publish directory: frontend

No build command required


🧠 What I Learned

Building REST APIs with Express

MongoDB Atlas cloud integration

JWT authentication & security

Environment variable management

Deploying full-stack apps

Debugging real production issues

Git & GitHub workflow


📌 Future Improvements

Password reset

Habit categories

Progress analytics

Mobile responsiveness

React frontend

Email notifications


👨‍💻 Author

Mohammed Athar

GitHub: https://github.com/athar-04


⭐ Support

If you like this project:

    ⭐ Star the repository
    
    🍴 Fork it
    
    📩 Share feedback
