# Personal Library Manager

A full-stack MERN application that allows users to search for books using the Google Books API and manage their personal reading library.

## 🚀 Features

- **🔍 Book Search**: Search books using Google Books API (public, no login required)
- **🔐 User Authentication**: Secure registration and login with JWT
- **📚 Personal Library**: Save books to your personal collection
- **📊 Reading Status**: Track books as "Want to Read", "Reading", or "Completed"
- **✏️ Personal Reviews**: Add and edit personal reviews for each book
- **🗑️ Book Management**: Remove books from your library
- **🔒 Protected Routes**: Secure pages accessible only to logged-in users
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- React.js (Functional Components & Hooks)
- React Router DOM (v7)
- Axios (with Interceptors)
- Context API (State Management)
- CSS3 (Custom Styling)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)

### External API
- Google Books API

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-library-manager.git
cd personal-library-manager
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_BOOKS_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret_key_min_32_characters
JWT_EXPIRE=30d
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

Server will run on `http://localhost:5001`

### 3. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
```

Start the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_BOOKS_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/books_db` |
| `PORT` | Server port | `5001` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your_super_secret_key_here` |
| `JWT_EXPIRE` | JWT token expiration time | `30d` |

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Book Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/books/search?query=keyword` | Public | Search books via Google Books API |
| GET | `/api/books` | Private | Get user's saved books |
| POST | `/api/books` | Private | Save book to library |
| PUT | `/api/books/:id` | Private | Update book status/review |
| DELETE | `/api/books/:id` | Private | Delete book from library |

## 🏗️ Project Structure
```
personal-library-manager/
├── client/                  # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/            # Axios configuration & interceptors
│   │   │   └── axiosConfig.js
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   └── ProtectedRoute.js
│   │   ├── context/        # React Context for state management
│   │   │   └── AuthContext.js
│   │   ├── pages/          # Page components
│   │   │   ├── SearchPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── MyLibraryPage.js
│   │   ├── services/       # API service functions
│   │   │   └── bookService.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── server/                  # Backend Node/Express application
│   ├── config/             # Configuration files
│   │   └── db.js
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   └── booksController.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   └── bookRoutes.js
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔒 Security Features

### Axios Interceptors

**Request Interceptor**: Automatically attaches JWT token to all API requests
```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

**Response Interceptor**: Handles 401 errors and auto-logout
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Password Security
- Passwords hashed using bcryptjs with salt rounds
- Passwords never stored in plain text
- Password field excluded from queries by default

### JWT Authentication
- Tokens expire after 30 days
- Tokens verified on every protected route
- User identity attached to requests via middleware

## 🎨 Key Features Explained

### Public Book Search
- Anyone can search for books without authentication
- Results fetched from Google Books API
- Displays title, authors, description, and thumbnail

### Personal Library Management
- Only authenticated users can save books
- Each user has their own private library
- Books are tied to user ID in database

### Reading Status Tracking
- Three status options: "Want to Read", "Reading", "Completed"
- Status persists in database
- Filter books by status

### Personal Reviews
- Add personal notes/reviews for each book
- Edit reviews anytime
- Maximum 1000 characters per review

## 🧪 Testing the Application

### Manual Testing Checklist

- [ ] Search for books (public, no login)
- [ ] Register new user
- [ ] Login with credentials
- [ ] Save book to library
- [ ] View saved books in My Library
- [ ] Change book status
- [ ] Add personal review
- [ ] Edit existing review
- [ ] Filter books by status
- [ ] Delete book from library
- [ ] Logout
- [ ] Try accessing /my-library without login (should redirect)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variable: `REACT_APP_API_URL=your_backend_url`
4. Deploy

### Backend (Render/Railway)
1. Connect GitHub repository
2. Add all environment variables
3. Deploy

## 📚 Dependencies

### Backend
```json
{
  "axios": "^1.13.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "express": "^4.18.0",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^8.0.0"
}
```

### Frontend
```json
{
  "axios": "^1.13.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.12.0",
  "react-scripts": "5.0.1"
}
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is [MIT](LICENSE) licensed.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Google Books API for book data
- MongoDB Atlas for database hosting
- React.js community for excellent documentation

---

**Made with ❤️ using MERN Stack**
```

---

## **Step 3: Create .gitignore** (5 minutes)

Create `.gitignore` in **root directory**:
```
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
server/.env
client/.env
.env.local
.env.production

# Production builds
client/build/
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS Files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/

# Misc
.npm
.eslintcache

