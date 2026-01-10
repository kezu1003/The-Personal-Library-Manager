import React, { useState } from 'react';
import { searchBooks, saveBook } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [savingBookId, setSavingBookId] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await searchBooks(query);
      setBooks(data.data || []);
      
      if (data.data.length === 0) {
        setError('No books found. Try a different search term.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (book) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSavingBookId(book.googleId);
    try {
      await saveBook(book);
      alert('Book saved to your library!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save book');
    } finally {
      setSavingBookId(null);
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>📚 Personal Library Manager</h1>
        <p>Search for books and build your personal library</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching for books...</p>
        </div>
      )}

      {!loading && hasSearched && books.length > 0 && (
        <div className="search-results">
          <h2>Found {books.length} book(s)</h2>
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.googleId} className="book-card">
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
                      onClick={() => handleSaveBook(book)}
                      className="btn-save"
                      disabled={savingBookId === book.googleId}
                    >
                      {savingBookId === book.googleId ? 'Saving...' : '+ Save to Library'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="welcome-message">
          <h2>Welcome to Personal Library Manager</h2>
          <p>Start by searching for books above</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;