import Book from '../models/Book.js';
import axios from 'axios';


// @desc    Get all books for logged-in user
// @route   GET /api/books
// @access  Private
export const getAllBooks = async (req, res) => {
    try {
        // Get books only for the authenticated user
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Get all books error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching books'
        });
    }
};

// @desc    Save a book to user's library
// @route   POST /api/books
// @access  Private
export const createBook = async (req, res) => {
    try {
        const { googleId, title, subtitle, authors, description, thumbnail, link } = req.body;

        // Validation
        if (!googleId || !title) {
            return res.status(400).json({
                success: false,
                message: 'Google ID and title are required'
            });
        }

        // Check if book already exists for this user
        const existingBook = await Book.findOne({ 
            user: req.user._id, 
            googleId: googleId 
        });

        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: 'Book already saved to your library'
            });
        }

        // Create new book
        const book = await Book.create({
            user: req.user._id,
            googleId,
            title,
            subtitle: subtitle || '',
            authors: authors || ['Unknown Author'],
            description: description || 'No description available',
            thumbnail: thumbnail || '',
            link: link || '',
            status: 'Want to Read', // Default status
            personalReview: ''
        });

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Create book error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Book already exists in your library'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error saving book'
        });
    }
};

// @desc    Update book (status or review)
// @route   PUT /api/books/:id
// @access  Private
export const updateBook = async (req, res) => {
    try {
        const { status, personalReview } = req.body;

        // Find book and verify ownership
        let book = await Book.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found in your library'
            });
        }

        // Update fields if provided
        if (status) {
            if (!['Want to Read', 'Reading', 'Completed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be "Want to Read", "Reading", or "Completed"'
                });
            }
            book.status = status;
        }

        if (personalReview !== undefined) {
            book.personalReview = personalReview;
        }

        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating book'
        });
    }
};

// @desc    Delete book from library
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook = async (req, res) => {
    try {
        // Find and delete book, verify ownership
        const book = await Book.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found in your library'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book removed from library',
            data: book
        });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting book'
        });
    }
};

// @desc    Search books from Google Books API
// @route   GET /api/books/search?query=javascript
// @access  Public
export const searchGoogleBooks = async (req, res) => {
    try {
        const { query, page = 1 } = req.query; // Add page parameter
        const booksPerPage = 10; // Books per page
        const startIndex = (page - 1) * booksPerPage;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Fetch from Google Books with pagination
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${booksPerPage}&startIndex=${startIndex}`
        );

        const books = response.data.items?.map(item => ({
            googleId: item.id,
            title: item.volumeInfo.title,
            subtitle: item.volumeInfo.subtitle || '',
            authors: item.volumeInfo.authors || ['Unknown Author'],
            description: item.volumeInfo.description || 'No description available',
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
            link: item.volumeInfo.previewLink || item.volumeInfo.infoLink
        })) || [];

        res.status(200).json({
            success: true,
            count: books.length,
            totalItems: response.data.totalItems || 0, // Total available books
            currentPage: parseInt(page),
            booksPerPage: booksPerPage,
            data: books
        });
    } catch (error) {
        console.error('Search Google Books error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error searching books from Google Books API'
        });
    }
};