# 🚀 RouteMate

A React-based web app that allows **only authenticated users** to draw a route between two points on a map.

## 📌 Features

✅ **User Authentication**

* Secure login screen
* Access to the map only for authenticated users

✅ **Map & Routing**

* Interactive map using **react-leaflet/api**
* User can input or click to select **Point A** and **Point B**
* Draws a route between selected points using **Leaflet Routing Machine**

✅ **Bonus Features**

* Use current location as Point A
* Shows distance and estimated time for the route
* Responsive design & loading states
* Day/Night map themes

## ⚙️ Tech Stack

* **Frontend:** React
* **Map:** react-leaflet/api
* **Routing:** Leaflet Routing Machine
* **Authentication:** Custom Node.js backend

## 🗂️ Project Structure

```
client/
├── eslint.config.js
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
├── README.md
├── src/
│   ├── App.jsx
│   ├── assets/
│   ├── components/
│   │   ├── AuthForm.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MapContainer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── index.css
│   ├── main.jsx
│   └── utils/
│       └── axios.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js

server/(Node Backend)
├── config/
├── controllers/
│   ├── auth.controller.js
│   └── home.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   └── user.js
├── node_modules/
├── package-lock.json
├── package.json
├── routes/
│   ├── auth.routes.js
│   └── home.routes.js
└── server.js

```

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/NajimuddinS/TheProductLabs.git
cd TheProductLabs
```

### 2️⃣ Install dependencies

```bash
# For frontend
npm install

# For backend
cd server
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file for backend with your secrets (DB connection, JWT secret, etc).

### 4️⃣ Run the backend server

```bash
cd server
npm start
```

### 5️⃣ Run the frontend

```bash
npm start
```

## 🎯 How to Use

1. Register or log in.
2. Once authenticated, access the map screen.
3. Click or input to set **Point A** and **Point B**.
4. View the drawn route with distance and time.
5. Optionally use your current location as the starting point.

## 🌙 Bonus

* Toggle between Day/Night map themes.

🚀 *Happy mapping!*
