# CertifyHub Frontend

React + Vite web application for the CertifyHub event management system. Beautiful, responsive UI for managing events and registrations.

## 🎨 Features

- **User Authentication** - Secure login and registration
- **Event Discovery** - Browse and search events
- **Event Registration** - Seamless registration flow
- **User Dashboard** - Manage your events and registrations
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Instant feedback on actions
- **Certificate Viewing** - View and download certificates
- **User Profile** - Manage personal information

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **CSS Processing:** PostCSS
- **Linting:** ESLint
- **Runtime:** Node.js >=18.0.0
- **Package Manager:** npm

## 📋 Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn
- Backend API running (http://localhost:5000 or deployed URL)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh181507/CertifyHub-Frontend.git
cd CertifyHub-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

**For Production (Vercel):**
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🗂️ Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx        # Home page
│   │   ├── Auth.jsx           # Login/Register page
│   │   ├── Dashboard.jsx      # User dashboard
│   │   └── Events.jsx         # Events listing
│   ├── components/
│   │   └── Navbar.jsx         # Navigation bar
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.jsx                # Root component
│   ├── App.css                # Global styles
│   ├── index.css              # Base styles
│   └── main.jsx               # Entry point
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
├── eslint.config.js           # ESLint config
└── .env.example               # Environment template
```

## 🔗 API Integration

The frontend connects to the backend API using the `VITE_API_URL` environment variable.

### Example API Call

```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Login
async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

// Get all events
async function getEvents() {
  const response = await fetch(`${API_URL}/api/events`);
  return response.json();
}
```

## 🎨 Styling

The project uses **Tailwind CSS** for styling.

### Tailwind Classes Example

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Welcome</h1>
</div>
```

## 🔐 Authentication

The app handles JWT tokens for secure authentication:

```javascript
// After login, token is stored
localStorage.setItem('token', token);

// Use token in API requests
const response = await fetch(`${API_URL}/api/protected`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Logout
localStorage.removeItem('token');
```

## 📱 Responsive Design

The app is fully responsive and works on:
- ✅ Mobile devices (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Large screens (1440px+)

Example responsive classes:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Automatic (Dashboard)

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import `CertifyHub-Frontend` repository
5. Set `VITE_API_URL` environment variable
6. Click "Deploy"

#### Option 2: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Environment Variables for Production

In Vercel dashboard, set:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

Then trigger a redeploy.

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

## 🐛 Troubleshooting

### Blank Page or 404 Errors
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Ensure backend is running and accessible

### API Fetch Errors
- Check CORS is enabled on backend
- Verify backend URL is correct
- Test API manually with cURL or Postman

### Styling Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild: `npm run build`
- Check Tailwind config is correct

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | UI framework |
| vite | Latest | Build tool |
| tailwindcss | Latest | Styling |
| eslint | Latest | Code linting |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Harsh Verma**
- GitHub: [@Harsh181507](https://github.com/Harsh181507)
- Frontend Repo: [CertifyHub-Frontend](https://github.com/Harsh181507/CertifyHub-Frontend)
- Backend Repo: [CertifyHub-Backend](https://github.com/Harsh181507/CertifyHub-Backend)
- Main Project: [CertifyHub](https://github.com/Harsh181507/CertifyHub)

## 🙏 Acknowledgments

- React documentation
- Vite guides
- Tailwind CSS documentation
- Vercel deployment guides

## 📞 Support

For issues:
1. Check the troubleshooting section
2. Review the logs in browser console
3. Verify backend connectivity
4. Check environment variables
5. Open an issue on GitHub

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🚀 Quick Start Summary

```bash
# Clone and setup
git clone https://github.com/Harsh181507/CertifyHub-Frontend.git
cd CertifyHub-Frontend
npm install

# Create .env
cp .env.example .env.local
# Edit .env.local with backend URL

# Start development
npm run dev

# Build for production
npm run build
```

**Happy Coding! 🎉**
