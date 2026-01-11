import express from "express";
import cors from "cors";
import booksRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MONGO_BOOKS_URI);

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for production
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({ 
        message: "BookShelf API is running",
        version: "1.0.0",
        status: "OK"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        message: "Route not found" 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});