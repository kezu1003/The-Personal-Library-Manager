import React, { useState, useEffect } from 'react';
import { getMyBooks, deleteBook, updateBook } from '../services/bookService';
import './MyLibraryPage.css';

const MyLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getMyBooks();
      setBooks(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book?')) {
      return;
    }

    try {
      await deleteBook(bookId);
      setBooks(books.filter(book => book._id !== bookId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      const response = await updateBook(bookId, { status: newStatus });
      setBooks(books.map(book => 
        book._id === bookId ? response.data : book
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleReviewSubmit = async (bookId, review) => {
    try {
      const response = await updateBook(bookId, { personalReview: review });
      setBooks(books.map(book => 
        book._id === bookId ? response.data : book
      ));
      setEditingBook(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update review');
    }
  };

  const filteredBooks = filter === 'All' 
    ? books 
    : books.filter(book => book.status === filter);

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Personal Library</h1>
        <p>Total Books: {books.length}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {books.length > 0 && (
        <div className="filter-buttons">
          {['All', 'Want to Read', 'Reading', 'Completed'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {filteredBooks.length === 0 && !loading && (
        <div className="empty-state">
          <h2>No books {filter !== 'All' ? `with status "${filter}"` : 'in your library yet'}</h2>
          <p>Start by searching and saving books!</p>
          <a href="/" className="btn-primary">Search Books</a>
        </div>
      )}

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div key={book._id} className="library-book-card">
            <div className="book-thumbnail">
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            
            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              {book.subtitle && (
                <p className="book-subtitle">{book.subtitle}</p>
              )}
              
              <p className="book-authors">
                By: {book.authors.join(', ')}
              </p>
              
              <p className="book-description">
                {truncateText(book.description)}
              </p>

              <div className="book-status-section">
                <label>Status:</label>
                <select
                  value={book.status}
                  onChange={(e) => handleStatusChange(book._id, e.target.value)}
                  className="status-select"
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {editingBook === book._id ? (
                <div className="review-edit">
                  <textarea
                    defaultValue={book.personalReview}
                    placeholder="Write your personal review..."
                    rows="4"
                    id={`review-${book._id}`}
                  />
                  <div className="review-actions">
                    <button 
                      onClick={() => {
                        const review = document.getElementById(`review-${book._id}`).value;
                        handleReviewSubmit(book._id, review);
                      }}
                      className="btn-save-review"
                    >
                      Save Review
                    </button>
                    <button 
                      onClick={() => setEditingBook(null)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="review-display">
                  <label>My Review:</label>
                  <p className="personal-review">
                    {book.personalReview || 'No review yet'}
                  </p>
                  <button 
                    onClick={() => setEditingBook(book._id)}
                    className="btn-edit-review"
                  >
                    {book.personalReview ? 'Edit Review' : 'Add Review'}
                  </button>
                </div>
              )}
              
              <div className="book-actions">
                <a 
                  href={book.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-view"
                >
                  View on Google Books
                </a>
                <button 
                  onClick={() => handleDelete(book._id)}
                  className="btn-delete"
                >
                  Remove from Library
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLibraryPage;



