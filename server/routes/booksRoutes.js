import express from 'express';
import { 
    getAllBooks, 
    createBook, 
    updateBook, 
    deleteBook,
    searchGoogleBooks 
} from '../controllers/booksController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - Google Books search (no auth required)
router.get('/search', searchGoogleBooks);

// Protected routes - User's personal library
router.get('/', protect, getAllBooks);
router.post('/', protect, createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

export default router;