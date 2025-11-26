import { useState, useEffect, useRef } from 'react';
import useTechnologiesApi from '../hooks/useTechnologyApi';
import './TechnologySearch.css';

function TechnologySearch({ onSearchResults, onSearchStateChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchTechnologies, loading, error } = useTechnologiesApi();
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = async (query) => {
    if (onSearchStateChange) {
      onSearchStateChange({ loading: true, error: null });
    }

    try {
      const results = await searchTechnologies(query);
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (err) {
      if (onSearchStateChange) {
        onSearchStateChange({ loading: false, error: err.message });
      }
    } finally {
      if (onSearchStateChange) {
        onSearchStateChange({ loading: false, error: null });
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймер для debounce (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearchResults) {
      onSearchResults(null);
    }
    if (onSearchStateChange) {
      onSearchStateChange({ loading: false, error: null });
    }
  };

  return (
    <div className="technology-search">
      <div className="search-header">
        <h3>Поиск технологий в базе знаний</h3>
        <p>Ищите технологии по названию, описанию или категории</p>
      </div>

      <div className="search-box">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Введите название технологии..."
            value={searchTerm}
            onChange={handleInputChange}
            className="search-input"
          />
          {loading && <div className="search-spinner">?..</div>}
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="clear-search-btn"
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>

        <div className="search-info">
          {searchTerm && !loading && (
            <span>Поиск: "{searchTerm}"</span>
          )}
        </div>
      </div>

      {error && (
        <div className="search-error">
          Ошибка поиска: {error}
        </div>
      )}

    </div>
  );
}

export default TechnologySearch;