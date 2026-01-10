import express from "express";
import cors from "cors";
import booksRoutes from "./routes/booksRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ADD THIS
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MONGO_BOOKS_URI);

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/books", booksRoutes); // Changed from /api/book to /api/books (plural is RESTful convention)
app.use("/api/auth", authRoutes); // ADD THIS - Authentication routes

// Health check route
app.get("/", (req, res) => {
    res.json({ 
        message: "Personal Library Manager API is running",
        version: "1.0.0"
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