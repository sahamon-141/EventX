# CertifyHub Backend API

A robust Node.js/Express REST API backend for the CertifyHub event management system. Handles user authentication, event management, participant registration, and certificate generation.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Event Management** - Create, read, update, and delete events
- **Event Registration** - Manage participant registrations for events
- **Certificate Generation** - Automatic certificate generation and distribution
- **Email Notifications** - Send emails for registrations, confirmations, and certificates
- **CORS Support** - Ready for integration with multiple frontend clients
- **Error Handling** - Comprehensive error handling and validation
- **MongoDB Integration** - Scalable NoSQL database with Mongoose ODM

## 🛠️ Tech Stack

- **Runtime:** Node.js >=18.0.0
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs
- **Email:** Nodemailer
- **Validation:** express-validator
- **PDF Generation:** pdf-lib
- **Environment:** dotenv

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js v18.0.0 or higher
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager
- Gmail account (for email notifications) - requires app-specific password

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh181507/CertifyHub-Backend.git
cd CertifyHub-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/certifyhub?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_here_use_a_strong_random_string
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_digit_app_password

# Client Configuration
CLIENT_URL=http://localhost:5173
```

### 4. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user with username and password
4. Get the connection string from "Connect" → "Drivers"
5. Replace the credentials in your `.env` file

### 5. Configure Email (Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-digit password in `EMAIL_PASSWORD` in `.env`

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

This uses nodemon for auto-restart on file changes.

Server will start on `http://localhost:5000`

### Production Mode

```bash
npm start
```

### Health Check

```bash
curl http://localhost:5000/
# Response: Backend is running 🚀
```

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user profile |
| PUT | `/users/:id` | Update user profile |
| GET | `/users` | Get all users (admin) |

### Event Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get all events |
| GET | `/events/:id` | Get event details |
| POST | `/events` | Create new event |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |

### Registration Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/registrations` | Register for event |
| GET | `/registrations/:eventId` | Get event registrations |
| PUT | `/registrations/:id` | Update registration |
| DELETE | `/registrations/:id` | Cancel registration |

### Certificate Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/certificate/:registrationId` | Generate certificate |
| POST | `/certificate/email` | Email certificate to user |

### Email Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email/send` | Send email notification |

## 📄 Example Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

Response includes JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Create Event (includes JWT token in header)

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Web Development Workshop",
    "description": "Learn modern web development",
    "date": "2026-05-15",
    "maxParticipants": 50,
    "location": "Online"
  }'
```

## 🗂️ Project Structure

```
CertifyHub-Backend/
├── routes/                    # API route handlers
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── eventRoutes.js
│   ├── registrationRoutes.js
│   ├── certificateRoutes.js
│   └── emailRoutes.js
├── models/                    # Mongoose schemas
│   ├── User.js
│   ├── Event.js
│   └── Registration.js
├── middleware/                # Custom middleware
│   └── authMiddleware.js      # JWT verification
├── index.js                   # Server entry point
├── package.json               # Dependencies
├── Procfile                   # Render deployment
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🔐 Security Features

- **Password Hashing:** bcryptjs for secure password storage
- **JWT Authentication:** Secure token-based authentication
- **CORS Protection:** Configurable CORS for frontend integration
- **Input Validation:** express-validator for request validation
- **Environment Variables:** Sensitive data in .env (not committed)
- **HTTP Headers:** Proper security headers for API responses

## 🚢 Deployment

### Deploy to Render

1. Push code to GitHub:
```bash
git push origin main
```

2. Go to [Render Dashboard](https://dashboard.render.com/)

3. Create Web Service from GitHub repository

4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=3000` (Render assigns port automatically)
   - `MONGO_URI=your_mongodb_atlas_url`
   - `JWT_SECRET=your_secret_key`
   - Other variables from `.env.example`

6. Deploy and get your public URL

See [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) for detailed instructions.

## 🐛 Troubleshooting

### MongoDB Connection Fails
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure username and password are correct
- Test connection string locally

### Email Not Sending
- Verify app password is 16 digits
- Check 2FA is enabled on Google Account
- Ensure `EMAIL_USER` matches the account with 2FA
- Check SMTP settings (should be `smtp.gmail.com`)

### JWT Token Issues
- Token may be expired (check `JWT_EXPIRE` setting)
- Ensure token is sent in `Authorization: Bearer TOKEN` header
- Verify `JWT_SECRET` is consistent across app instances

### Port Already in Use
```bash
# Find and kill process using port 5000
npx kill-port 5000
# Or change PORT in .env
```

## 📝 Environment Variables Reference

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| NODE_ENV | String | Yes | App environment | development, production |
| PORT | Number | Yes | Server port | 5000, 3000 |
| MONGO_URI | String | Yes | MongoDB connection | mongodb+srv://... |
| JWT_SECRET | String | Yes | JWT signing key | random_secure_string |
| JWT_EXPIRE | String | Yes | JWT expiration | 7d, 24h |
| EMAIL_SERVICE | String | Yes | Email provider | gmail |
| EMAIL_USER | String | Yes | Sender email | your_email@gmail.com |
| EMAIL_PASSWORD | String | Yes | App password | 16_digit_password |
| CLIENT_URL | String | Yes | Frontend URL | http://localhost:5173 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Harsh Verma**
- GitHub: [@Harsh181507](https://github.com/Harsh181507)
- Repository: [CertifyHub-Backend](https://github.com/Harsh181507/CertifyHub-Backend)
- Main Project: [CertifyHub](https://github.com/Harsh181507/CertifyHub)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB Atlas guides
- Nodemailer integration patterns
- JWT best practices

## 📞 Support

For issues:
1. Check this README for common solutions
2. Review the troubleshooting section
3. Check your MongoDB and email configurations
4. Open an issue on GitHub

---

## 🚀 Quick Start Recap

```bash
# 1. Clone repo
git clone https://github.com/Harsh181507/CertifyHub-Backend.git
cd CertifyHub-Backend

# 2. Install dependencies
npm install

# 3. Create and configure .env
cp .env.example .env
# Edit .env with your credentials

# 4. Start development server
npm run dev

# 5. Test health endpoint
curl http://localhost:5000/
```

**Happy Coding! 🎉**
