# 🎉 EventX - Event Management System

> 📚 **Assignment Project** | Full-Stack Event Management Platform

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-13AA52?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ What is EventX?

A **modern, full-stack event management platform** that brings events to life! 🚀

- 🎪 **Organizers** can create and manage events effortlessly
- 👥 **Participants** can discover, register, and pay for events  
- 🎓 **Certificates** are automatically generated after event completion
- 💳 **Secure payments** integrated with Razorpay
- 📧 **Email notifications** keep everyone updated

---

## ✨ Key Features

### 🎯 For Event Organizers
✅ Create and manage events | 👥 Track registrations | 📊 View analytics | 🎖️ Generate certificates | 💰 Payment tracking

### 🎟️ For Participants  
✅ Browse events | 📝 Register with ease | 💳 Secure payments | 🎓 Download certificates | 📜 Verify certificates

### 🔧 Platform Highlights
✅ JWT Authentication | ✅ MongoDB Database | ✅ Email Notifications | ✅ PDF Certificates | ✅ Responsive Design

---

## � Screenshots

### Landing Page & Navigation
  
  ![Landing Page](https://github.com/user-attachments/assets/bb22e257-d982-432b-9a3f-4cb8059462c6)
  ![Event Discovery](https://github.com/user-attachments/assets/809be9dd-02ba-4504-b90d-e72eeccb7746)
 
### Event Registration & Payment
![Registration Form](https://github.com/user-attachments/assets/33cf4dbd-f7ab-4589-83a9-da19b44db463)

 ![Payment Processing](https://github.com/user-attachments/assets/9d86217e-a0d7-4b9d-b884-01a0788dfe74)
 ![Payment Success](https://github.com/user-attachments/assets/b45c9142-59c7-4d78-9e1b-ba998382586c)


### Dashboard & User Profile
![User Profile](https://github.com/user-attachments/assets/6dc99e89-fef1-483a-b79d-787c5e9a0b85)

### Additional Features & Pages
![Certificate Verify](https://github.com/user-attachments/assets/371ac36f-2f47-4c3f-a1e3-d2d03d434353)
![Pricing Plans](https://github.com/user-attachments/assets/c90ce514-c9fc-4369-b72c-a4e906247056)


### Additional Page Views
![Email Confiramtion](https://github.com/user-attachments/assets/951d11b6-a14a-4107-9580-127dbc4ce0d7)
   
![Email Certificate](https://github.com/user-attachments/assets/b2c2735f-d7e6-45e3-b1a5-59ccecba76d2)

## �🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Other**: PostCSS, Autoprefixer

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express 5.2
- **Database**: MongoDB with Mongoose
- **Authentication**: JsonWebToken (JWT), bcryptjs
- **Payments**: Razorpay SDK
- **PDF Generation**: pdf-lib
- **Email**: Nodemailer
- **Validation**: express-validator
- **Scheduling**: node-cron
- **CORS**: cors middleware

---

## 🚀 Quick Start

### Prerequisites
✅ Node.js v18+ | ✅ MongoDB | ✅ Git

### Get Started (3 Steps)

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Harsh181507/CertifyHub.git
cd event-system

# 2️⃣ Install & Setup
cd server && npm install && cd ../client && npm install

# 3️⃣ Configure .env files (add your keys)
# Backend: server/.env | Frontend: client/.env
```

### Run Development Server

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

🎉 **Open browser:** http://localhost:5173

---

## 🏗️ Project Structure

```
CertifyHub/
├── client/               # React + Vite Frontend
│   └── src/
│       ├── pages/        # 20+ Page Components
│       ├── components/   # Reusable UI Components
│       └── assets/       # Images & Static Files
│
├── server/               # Express Backend
│   ├── routes/           # API Endpoints (30+)
│   ├── models/           # MongoDB Schemas
│   ├── middleware/       # Authentication
│   └── cronJob.js        # Scheduled Tasks
│
└── outputImages/         # Screenshots & Documentation
```

---

## 📚 API Endpoints

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth` | POST | Register, Login, Refresh Token |
| `/api/events` | GET, POST, PUT, DELETE | Event Management |
| `/api/registrations` | POST, GET, DELETE | Event Registration |
| `/api/certificates` | GET, POST | Certificate Generation & Verification |
| `/api/payments` | POST | Payment Processing (Razorpay) |
| `/api/email` | POST | Email Notifications |

---

## 📦 Database Models

**User** → `firstName`, `lastName`, `email`, `password`, `role`, `phone`, `profileImage`

**Event** → `title`, `description`, `date`, `location`, `price`, `organizer`, `maxParticipants`, `certificateTemplate`

**Registration** → `user`, `event`, `paymentStatus`, `certificateGenerated`, `attendanceStatus`

---

## 🔒 Security Features

🔐 **JWT Authentication** | 🔐 **Password Hashing (bcryptjs)** | 🔐 **CORS Configuration** | 🔐 **Input Validation**

---

## 📚 Environment Variables

Create `.env` files:

**Backend (`server/.env`):**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=CertifyHub
```

---

## ✅ Features Tested

✅ User Registration & Login  
✅ Event Creation & Management  
✅ Event Registration & Payment (Razorpay)  
✅ Certificate Auto-Generation  
✅ Certificate Verification  
✅ Email Notifications  
✅ Responsive Design  

---

## 🎯 Project Status

This is an **assignment project** showcasing a complete full-stack event management system with modern web technologies and best practices. ✨

---


</div>

