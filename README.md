<div align="center">

# 🎟️ The Event Canvas

### Discover. Book. Experience — Your Next Big Moment.

A full-stack **MERN event discovery and booking platform** for discovering events, managing bookings, and providing administrators with event and booking management tools.

<br>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge\&logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)

<br><br>

**[📂 View Repository](https://github.com/Aniruddha-Porey/The-Event-Canvas)**

</div>

---

## 📖 About The Project

**The Event Canvas** is a full-stack event booking application built using the **MERN stack**.

The platform allows users to discover events, explore event details, register and authenticate securely, book events, and manage their bookings from a personalized dashboard.

An administrator can manage events, monitor bookings, and track booking-related revenue through a dedicated dashboard.

The project was developed to demonstrate practical **full-stack web development, REST API integration, authentication, database management, and frontend-backend communication**.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 👤 User Experience

* User registration & login
* JWT authentication
* Secure password hashing
* OTP verification
* Browse available events
* Detailed event pages
* Event booking
* Booking history
* Booking status tracking
* User dashboard

</td>

<td width="50%">

### 🛠️ Administration

* Admin authentication
* Admin dashboard
* Event management
* Booking management
* Booking status monitoring
* Revenue tracking
* Role-based authorization

</td>
</tr>
</table>

---

## 🧩 Application Flow

```text
                         THE EVENT CANVAS
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  USER                    ADMIN
                    │                       │
              Register / Login          Admin Login
                    │                       │
                    ▼                       ▼
              Browse Events          Admin Dashboard
                    │                       │
                    ▼                 ┌─────┴─────┐
              Event Details           │           │
                    │              Events      Bookings
                    ▼
                 Booking
                    │
                    ▼
                 Payment
                /       \
          Success       Failed
             │             │
             └──────┬──────┘
                    ▼
             User Dashboard
```

---

## 🖥️ Screenshots

> Add your project screenshots here to make the repository visually attractive.

### 🏠 Home Page

<p align="center">
  <img src="client/src/assets/hero-bg.png" width="90%" alt="The Event Canvas Home Page">
</p>

### 🎟️ Event Experience

<p align="center">
  <img src="client/src/assets/logo.png" width="250" alt="The Event Canvas">
</p>

> **Tip:** For the best GitHub presentation, replace these example images with actual screenshots of your Home, Events, Event Details, Login, User Dashboard and Admin Dashboard pages.

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                      |
| --------------- | ---------------------------- |
| ⚛️ React.js     | User interface               |
| ⚡ Vite          | Frontend development & build |
| 🎨 CSS          | Styling & responsive UI      |
| 🧭 React Router | Client-side navigation       |

### Backend

| Technology    | Purpose                 |
| ------------- | ----------------------- |
| 🟢 Node.js    | Server-side runtime     |
| 🚂 Express.js | REST API                |
| 🍃 MongoDB    | Database                |
| 📦 Mongoose   | MongoDB object modeling |

### Security & Services

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| 🔐 JWT        | Authentication            |
| 🔒 bcrypt.js  | Password hashing          |
| 📧 Nodemailer | Email & OTP functionality |

---

## 📁 Project Structure

```text
TheEventCanvas/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aniruddha-Porey/The-Event-Canvas.git
cd The-Event-Canvas
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

> ⚠️ **Never commit your actual `.env` file to GitHub.**

---

## ▶️ Run Locally

### Start the backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Authentication

The application uses:

* JWT-based authentication
* bcrypt password hashing
* Role-based authorization
* OTP verification
* Protected routes

User roles include:

```text
USER
 └── Access events & manage bookings

ADMIN
 └── Manage events & monitor bookings
```

---

## 📊 Core Modules

```text
┌──────────────────────────────────────────────┐
│                THE EVENT CANVAS              │
├──────────────────────────────────────────────┤
│                                              │
│  Authentication                              │
│  ├── Register                                │
│  ├── Login                                   │
│  └── OTP Verification                        │
│                                              │
│  Events                                      │
│  ├── Browse Events                            │
│  ├── Event Details                            │
│  └── Event Management                         │
│                                              │
│  Bookings                                    │
│  ├── Create Booking                           │
│  ├── Booking Status                           │
│  └── Booking History                          │
│                                              │
│  Administration                              │
│  ├── Dashboard                               │
│  ├── Event Management                         │
│  ├── Booking Management                       │
│  └── Revenue Tracking                         │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎯 What I Learned

Building this project helped me strengthen my understanding of:

* Full-stack MERN development
* React component architecture
* REST API development
* MongoDB & Mongoose
* Authentication & authorization
* JWT implementation
* Password security
* OTP verification
* Email integration
* Frontend-backend integration
* Admin dashboard development
* Git & GitHub workflow

---

## 🔮 Future Improvements

* 💳 Real payment gateway integration
* 🎫 QR-code based digital tickets
* 🔎 Advanced event search & filtering
* ⭐ Event reviews and ratings
* 📧 Automated booking confirmation emails
* 📈 Advanced admin analytics
* ⚡ Real-time booking updates
* ☁️ Cloud deployment
* 📱 Further mobile optimization

---

## 👨‍💻 Author

<div align="center">

### Aniruddha Porey

**B.Tech — Computer Science & Engineering**
**Narula Institute of Technology**

Interested in:

`Web Development` • `MERN Stack` • `Programming` • `Cloud Computing`

<br>

[![GitHub](https://img.shields.io/badge/GitHub-Aniruddha--Porey-181717?style=for-the-badge\&logo=github)](https://github.com/Aniruddha-Porey)

</div>

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

**The Event Canvas — Discover. Book. Experience.**

</div>
