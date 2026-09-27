<div align="center">

# 🎟️ The Event Canvas

### Discover. Book. Experience — Your Next Big Moment.

A full-stack **MERN event discovery and booking platform** built to provide a smooth experience for discovering events, viewing event details, and managing bookings.

<br>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)

<br><br>

[📂 Repository](https://github.com/Aniruddha-Porey/The-Event-Canvas)

</div>

---

## 🌟 Overview

**The Event Canvas** is a full-stack event booking web application developed using the **MERN stack**.

Users can explore available events, view detailed event information, create an account, securely log in, and manage their event bookings.

The application also includes an administrative side for managing events and monitoring bookings.

---

# 🖥️ Screenshots

## 🏠 Homepage

<p align="center">
  <img src="screenshots/Homepage.png" width="95%" alt="The Event Canvas Homepage">
</p>

The homepage introduces the platform and provides users with a simple starting point for discovering events.

---

## 🔎 Explore Events

<p align="center">
  <img src="screenshots/explore.png" width="95%" alt="Explore Events">
</p>

The Explore section allows users to browse available events and discover experiences that interest them.

---

## 🎟️ Event Details

<p align="center">
  <img src="screenshots/Event_details.png" width="95%" alt="Event Details Page">
</p>

The Event Details page provides detailed information about an individual event before booking.

---

## 🔐 Login

<p align="center">
  <img src="screenshots/login.png" width="80%" alt="Login Page">
</p>

Users can securely sign in to access their account and booking features.

---

## 📝 Create Account

<p align="center">
  <img src="screenshots/Create_account.png" width="80%" alt="Create Account Page">
</p>

New users can create an account to access the event booking platform.

---

# ✨ Features

<table>
<tr>
<td width="50%">

### 👤 User Features

* User registration
* Secure login
* JWT authentication
* Password hashing
* OTP verification
* Browse events
* Event details
* Event booking
* Booking history
* Booking status
* User dashboard

</td>

<td width="50%">

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Event management
* Booking management
* Booking status monitoring
* Revenue tracking
* Role-based access control

</td>
</tr>
</table>

---

# 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                    |
| --------------- | -------------------------- |
| ⚛️ React.js     | User interface             |
| ⚡ Vite          | Development and build tool |
| 🎨 CSS          | Styling                    |
| 🧭 React Router | Navigation                 |

### Backend

| Technology    | Purpose           |
| ------------- | ----------------- |
| 🟢 Node.js    | Server runtime    |
| 🚂 Express.js | REST API          |
| 🍃 MongoDB    | Database          |
| 📦 Mongoose   | Database modeling |

### Authentication & Services

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| 🔐 JWT        | User authentication         |
| 🔒 bcrypt.js  | Password hashing            |
| 📧 Nodemailer | Email and OTP functionality |

---

# 🏗️ Architecture

```text
                         THE EVENT CANVAS
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
              FRONTEND                      BACKEND
                 │                             │
              React.js                    Node.js
                 │                         Express.js
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ▼
                           MongoDB
                                │
                                ▼
                       Application Data
```

---

# 🔄 User Flow

```text
        👤 User
          │
          ▼
   Create Account / Login
          │
          ▼
     Explore Events
          │
          ▼
     Event Details
          │
          ▼
       Book Event
          │
          ▼
    Booking Status
          │
          ▼
    User Dashboard
```

---

# 📁 Project Structure

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
├── screenshots/
│   ├── Homepage.png
│   ├── explore.png
│   ├── Event_details.png
│   ├── login.png
│   └── Create_account.png
│
├── .gitignore
├── package-lock.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Aniruddha-Porey/The-Event-Canvas.git
cd The-Event-Canvas
```

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

> ⚠️ Never upload your real `.env` file or credentials to GitHub.

---

# ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

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

# 🔐 Security

The application implements several security-related features:

* JWT-based authentication
* Password hashing with bcrypt
* Protected routes
* Role-based authorization
* OTP verification
* Environment-based configuration

---

# 📚 What I Learned

Building The Event Canvas helped me gain practical experience with:

* Full-stack MERN development
* React component architecture
* REST API development
* MongoDB and Mongoose
* Authentication and authorization
* JWT implementation
* Password security
* OTP verification
* Email integration
* Frontend-backend integration
* Admin dashboard development
* Git and GitHub

---

# 🔮 Future Improvements

* 💳 Online payment gateway integration
* 🎫 QR-code based digital tickets
* 🔎 Advanced event search and filtering
* ⭐ Event reviews and ratings
* 📧 Automated booking confirmation emails
* 📈 Advanced admin analytics
* ⚡ Real-time booking updates
* ☁️ Cloud deployment
* 📱 Improved mobile experience

---

# 👨‍💻 Author

<div align="center">

## Aniruddha Porey

**B.Tech — Computer Science & Engineering**

**Narula Institute of Technology**

<br>

`Web Development` • `MERN Stack` • `Programming` • `Cloud Computing`

<br>

[![GitHub](https://img.shields.io/badge/GitHub-Aniruddha--Porey-181717?style=for-the-badge\&logo=github)](https://github.com/Aniruddha-Porey)

</div>

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

### 🎟️ The Event Canvas

**Discover. Book. Experience.**

</div>
