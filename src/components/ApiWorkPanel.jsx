import { useState, useEffect, useCallback } from 'react';
import useTechnologiesApi from '../hooks/useTechnologyApi';
import './ApiWorkPanel.css';

function ApiWorkPanel({ onAddTechnology }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const { searchTechnologies, fetchTechnologies, loading, error } = useTechnologiesApi();

  // Правильный обработчик с useCallback
  const handleAddToTracker = useCallback((tech) => {
    if (onAddTechnology) {
      // Создаем дедлайн на 30 дней вперед - вызывается только при клике
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 30);
      
      onAddTechnology({
        ...tech,
        deadline: deadlineDate.toISOString()
      });
    }
  }, [onAddTechnology]);

  // Мемоизируем функцию handleLoadAll
  const handleLoadAll = useCallback(async () => {
    try {
      const results = await fetchTechnologies();
      setSearchResults(results);
    } catch (err) {
      console.error('Load error:', err);
    }
  }, [fetchTechnologies]);

  // Используем useEffect для дебаунсинга поиска
  useEffect(() => {
    // Создаем асинхронную функцию внутри useEffect
    const performSearch = async () => {
      if (searchTerm.trim()) {
        try {
          const results = await searchTechnologies(searchTerm);
          setSearchResults(results);
        } catch (err) {
          console.error('Search error:', err);
        }
      }
    };

    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchTechnologies]); // Теперь searchTechnologies в зависимостях

  const filteredResults = searchResults.filter(tech => {
    if (category !== 'all' && tech.category !== category) return false;
    if (difficulty !== 'all' && tech.difficulty !== difficulty) return false;
    return true;
  });

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="api-work-panel">
      <div className="api-panel-header">
        <h3>Работа с API Базы Знаний</h3>
        <p>Поиск и добавление технологий из внешней базы данных</p>
      </div>

      <div className="api-controls">
        <div className="search-section">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Введите название технологии..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="api-search-input"
            />
            {loading && <div className="search-loading">Поиск...</div>}
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

          <button onClick={handleLoadAll} disabled={loading} className="btn btn-secondary">
            Загрузить все технологии
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Категория:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Все</option>
              <option value="frontend">Фронтенд</option>
              <option value="backend">Бэкенд</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Сложность:</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="all">Все</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="api-error">
          Ошибка: {error}
        </div>
      )}

      <div className="api-results">
        <div className="results-header">
          <h4>Найдено технологий: {filteredResults.length}</h4>
          {searchTerm && (
            <span className="search-term-display">
              Поиск: "{searchTerm}"
            </span>
          )}
        </div>
        
        {filteredResults.length > 0 ? (
          <div className="api-tech-list">
            {filteredResults.map(tech => (
              <div key={tech.id} className="api-tech-card">
                <div className="api-tech-info">
                  <h5>{tech.title}</h5>
                  <p>{tech.description}</p>
                  <div className="api-tech-meta">
                    <span className={`category-badge ${tech.category}`}>
                      {tech.category === 'frontend' ? 'Фронтенд' : 'Бэкенд'}
                    </span>
                    <span className={`difficulty-badge ${tech.difficulty}`}>
                      {tech.difficulty === 'beginner' && 'Начинающий'}
                      {tech.difficulty === 'intermediate' && 'Средний'}
                      {tech.difficulty === 'advanced' && 'Продвинутый'}
                    </span>
                    {tech.resources && tech.resources.length > 0 && (
                      <span className="resources-badge">
                        {tech.resources.length} ресурсов
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleAddToTracker(tech)}
                  className="btn btn-success"
                  disabled={loading}
                >
                  Добавить в трекер
                </button>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="api-empty-state">
            <p>Технологии по запросу "{searchTerm}" не найдены</p>
            <button 
              onClick={handleLoadAll}
              className="btn btn-primary"
            >
              Загрузить все технологии
            </button>
          </div>
        ) : (
          <div className="api-empty-state">
            <p>Введите поисковый запрос или загрузите все технологии</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiWorkPanel;