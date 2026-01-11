import React, { useState } from 'react';
import { useEffect } from 'react';
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [booksPerPage, setBooksPerPage] = useState(10);

  // Filter states
  const [freeEbooksOnly, setFreeEbooksOnly] = useState(false);
  const [printType, setPrintType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Slideshow images
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80',
      caption: 'Discover Your Next Great Read'
    },
    {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
      caption: 'Build Your Personal Library'
    },
    {
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
      caption: 'Track Your Reading Journey'
    },
    {
      url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80',
      caption: 'Organize and Review Your Books'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };


  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const filters = {
        freeEbooks: freeEbooksOnly,
        printType: printType
      };

      const data = await searchBooks(query, page, filters);
      setBooks(data.data || []);
      setTotalItems(data.totalItems || 0);
      setCurrentPage(data.currentPage || 1);
      setBooksPerPage(data.booksPerPage || 10);
      
      if (data.data.length === 0) {
        setError('No books found. Try different filters or search terms.');
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

  // Reset filters
  const handleResetFilters = () => {
    setFreeEbooksOnly(false);
    setPrintType('all');
    if (hasSearched) {
      setCurrentPage(1);
      handleSearch(null, 1);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1);
    handleSearch(null, 1);
    setShowFilters(false);
  };

  // Pagination functions
  const totalPages = Math.ceil(totalItems / booksPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      handleSearch(null, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      handleSearch(null, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleSearch(null, pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="search-logo-container">
            <img src="/logo.png" alt="BookShelf" className="search-page-logo" />
            <h1>BOOKSHELF</h1>
        </div>
        <h4>Your personal library manager - Search, save, and organize your books</h4>
        </div>

        <div className="slideshow-container">
        <div className="slideshow">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.url})` }}
            >
              <div className="slide-overlay">
                <h3 className="slide-caption">{slide.caption}</h3>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className="slide-arrow prev" onClick={previousSlide}>
            ❮
          </button>
          <button className="slide-arrow next" onClick={nextSlide}>
            ❯
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="slide-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
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

      {/* Filter Toggle Button */}
      <div className="filter-toggle-container">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="filter-toggle-btn"
        >
          🔍 {showFilters ? 'Hide Filters' : 'Show Filters'}
          {(freeEbooksOnly || printType !== 'all') && (
            <span className="filter-badge">Active</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={freeEbooksOnly}
                onChange={(e) => setFreeEbooksOnly(e.target.checked)}
                className="filter-checkbox"
              />
              <span>📖 Free E-books Only</span>
            </label>
          </div>

          <div className="filter-section">
            <label className="filter-label-text">Print Type:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="all"
                  checked={printType === 'all'}
                  onChange={(e) => setPrintType(e.target.value)}
                  className="filter-radio"
                />
                <span>All</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="books"
                  checked={printType === 'books'}
                  onChange={(e) => setPrintType(e.target.value)}
                  className="filter-radio"
                />
                <span>📚 Books</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="magazines"
                  checked={printType === 'magazines'}
                  onChange={(e) => setPrintType(e.target.value)}
                  className="filter-radio"
                />
                <span>📰 Magazines</span>
              </label>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleApplyFilters} className="btn-apply-filters">
              Apply Filters
            </button>
            <button onClick={handleResetFilters} className="btn-reset-filters">
              Reset
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching for books...</p>
        </div>
      )}

      {!loading && hasSearched && books.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h2>Found {totalItems} book(s)</h2>
            <div className="active-filters">
              {freeEbooksOnly && <span className="active-filter-tag">📖 Free E-books</span>}
              {printType !== 'all' && (
                <span className="active-filter-tag">
                  {printType === 'books' ? '📚 Books' : '📰 Magazines'}
                </span>
              )}
            </div>
            <p className="page-info">
              Showing page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="books-grid">
            {books.map((book) => (
              <div key={book.googleId} className="book-card">
                <div className="book-thumbnail">
                  {book.thumbnail ? (
                    <img src={book.thumbnail} alt={book.title} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  {book.isFree && <span className="free-badge">FREE</span>}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {currentPage > 3 && (
                  <>
                    <button onClick={() => handlePageClick(1)} className="page-number">
                      1
                    </button>
                    {currentPage > 4 && <span className="page-ellipsis">...</span>}
                  </>
                )}

                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageClick(pageNum)}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                ))}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="page-ellipsis">...</span>}
                    <button onClick={() => handlePageClick(totalPages)} className="page-number">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="welcome-message">
          <h2>Welcome to Personal Library Manager</h2>
          <h3>Start by searching for books above</h3>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

