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

  // Get counts for each status
  const statusCounts = {
    'All': books.length,
    'Want to Read': books.filter(b => b.status === 'Want to Read').length,
    'Reading': books.filter(b => b.status === 'Reading').length,
    'Completed': books.filter(b => b.status === 'Completed').length
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Want to Read': '📚',
      'Reading': '📖',
      'Completed': '✅',
      'All': '🎯'
    };
    return icons[status] || '📚';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Want to Read': '#2196F3',
      'Reading': '#FF9800',
      'Completed': '#4CAF50'
    };
    return colors[status] || '#666';
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
      {/* Enhanced Header with Stats */}
      <div className="library-header-enhanced">
        <div className="header-content">
          <div className="header-title-section">
            <h1>📚 My Personal Library</h1>
            <p className="header-subtitle">Your curated collection of books</p>
          </div>
          
          <div className="library-stats">
            <div className="stat-card">
              <span className="stat-icon">📖</span>
              <div className="stat-info">
                <span className="stat-number">{books.length}</span>
                <span className="stat-label">Total Books</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <span className="stat-number">{statusCounts['Want to Read']}</span>
                <span className="stat-label">To Read</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔖</span>
              <div className="stat-info">
                <span className="stat-number">{statusCounts['Reading']}</span>
                <span className="stat-label">Reading</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <span className="stat-number">{statusCounts['Completed']}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message-enhanced">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {books.length > 0 && (
        <div className="filter-section-enhanced">
          <div className="filter-header">
            <h3>Filter by Status</h3>
          </div>
          <div className="filter-buttons-enhanced">
            {['All', 'Want to Read', 'Reading', 'Completed'].map(status => (
              <button
                key={status}
                className={`filter-btn-enhanced ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                <span className="filter-icon">{getStatusIcon(status)}</span>
                <span className="filter-text">{status}</span>
                <span className="filter-count">{statusCounts[status]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredBooks.length === 0 && !loading && (
        <div className="empty-state-enhanced">
          <div className="empty-icon">📚</div>
          <h2>No books found</h2>
          <p>
            {filter !== 'All' 
              ? `You don't have any books with status "${filter}" yet.` 
              : 'Your library is empty. Start building your collection!'}
          </p>
          <a href="/" className="btn-primary-enhanced">
            <span>🔍</span>
            Search Books
          </a>
        </div>
      )}

      <div className="books-grid-enhanced">
        {filteredBooks.map((book) => (
          <div key={book._id} className="library-book-card-enhanced">
            <div className="book-thumbnail-enhanced">
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <div className="no-image-enhanced">
                  <span className="no-image-icon">📖</span>
                  <span className="no-image-text">No Cover</span>
                </div>
              )}
              <div 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(book.status) }}
              >
                {getStatusIcon(book.status)} {book.status}
              </div>
            </div>
            
            <div className="book-details-enhanced">
              <div className="book-header-section">
                <h3 className="book-title-enhanced">{book.title}</h3>
                {book.subtitle && (
                  <p className="book-subtitle-enhanced">{book.subtitle}</p>
                )}
                
                <div className="book-authors-enhanced">
                  <span className="author-icon">✍️</span>
                  {book.authors.join(', ')}
                </div>
              </div>
              
              <p className="book-description-enhanced">
                {truncateText(book.description)}
              </p>

              <div className="book-status-section-enhanced">
                <label className="section-label">
                  <span className="label-icon">🏷️</span>
                  Reading Status
                </label>
                <select
                  value={book.status}
                  onChange={(e) => handleStatusChange(book._id, e.target.value)}
                  className="status-select-enhanced"
                >
                  <option value="Want to Read">📚 Want to Read</option>
                  <option value="Reading">📖 Reading</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>

              {editingBook === book._id ? (
                <div className="review-edit-enhanced">
                  <label className="section-label">
                    <span className="label-icon">✏️</span>
                    Edit Your Review
                  </label>
                  <textarea
                    defaultValue={book.personalReview}
                    placeholder="Share your thoughts about this book..."
                    rows="4"
                    id={`review-${book._id}`}
                    className="review-textarea"
                  />
                  <div className="review-actions-enhanced">
                    <button 
                      onClick={() => {
                        const review = document.getElementById(`review-${book._id}`).value;
                        handleReviewSubmit(book._id, review);
                      }}
                      className="btn-save-review-enhanced"
                    >
                      <span>💾</span>
                      Save Review
                    </button>
                    <button 
                      onClick={() => setEditingBook(null)}
                      className="btn-cancel-enhanced"
                    >
                      <span>✖️</span>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="review-display-enhanced">
                  <label className="section-label">
                    <span className="label-icon">💭</span>
                    My Review
                  </label>
                  <div className="personal-review-enhanced">
                    {book.personalReview ? (
                      <>
                        <p className="review-text">{book.personalReview}</p>
                        <button 
                          onClick={() => setEditingBook(book._id)}
                          className="btn-edit-review-enhanced"
                        >
                          <span>✏️</span>
                          Edit Review
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="no-review-text">No review yet</p>
                        <button 
                          onClick={() => setEditingBook(book._id)}
                          className="btn-add-review-enhanced"
                        >
                          <span>➕</span>
                          Add Review
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="book-actions-enhanced">
                <a 
                  href={book.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-view-enhanced"
                >
                  <span>🔗</span>
                  View Details
                </a>
                <button 
                  onClick={() => handleDelete(book._id)}
                  className="btn-delete-enhanced"
                >
                  <span>🗑️</span>
                  Remove
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

