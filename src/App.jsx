import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { useState } from 'react';
import Navigation from './components/Navigation';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import TechnologySearch from './components/TechnologySearch';
import useTechnologies from './hooks/useTechnologies';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import NotFound from './pages/NotFound';
import RoadmapImporter from './components/RoadmapImporter';
import EditTechnology from './pages/EditTechnology';
import DataImportExport from './components/DataImportExport';


function HomePage() {
    const {
        technologies,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses,
        addTechnology,
        updateTechnologyResources,
        bulkUpdateStatus
    } = useTechnologies();

    const [filter, setFilter] = useState('all');
    const [apiSearchResults, setApiSearchResults] = useState(null);
    const [searchState, setSearchState] = useState({ loading: false, error: null });
    const [showBulkEdit, setShowBulkEdit] = useState(false);

    const randomizeNextTechnology = () => {
        const notStarted = technologies.filter(tech => tech.status === 'not-started');
        if (notStarted.length > 0) {
            const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
            updateStatus(randomTech.id, 'in-progress');
        }
    };

    // Функция для обработки результатов поиска из API
    const handleSearchResults = (results) => {
        setApiSearchResults(results);
    };

    // Функция для обработки состояния поиска
    const handleSearchStateChange = (state) => {
        setSearchState(state);
    };

    // Функция для добавления технологии из поиска
    const handleAddFromSearch = (tech) => {
        addTechnology(tech);
        alert(`Технология "${tech.title}" добавлена в ваш трекер!`);
    };

    // Функция для обновления ресурсов технологии
    const handleResourcesUpdate = (techId, resources) => {
        updateTechnologyResources(techId, resources);
    };

    // Определяем какие технологии показывать
    const technologiesToShow = apiSearchResults || technologies;

    const filteredTechnologies = technologiesToShow.filter(tech => {
        const matchesFilter = filter === 'all' || tech.status === filter;
        return matchesFilter;
    });

    return (
        <div>
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                markAllAsCompleted={markAllAsCompleted}
                resetAllStatuses={resetAllStatuses}
                randomizeNextTechnology={randomizeNextTechnology}
                technologies={technologies}
                onShowBulkEdit={() => setShowBulkEdit(!showBulkEdit)}
                showBulkEdit={showBulkEdit}
            />

            {/* Компонент массового редактирования */}
            {showBulkEdit && (
                <BulkStatusEdit 
                    technologies={technologies}
                    onBulkUpdate={bulkUpdateStatus}
                />
            )}

            {/* Компонент импорта/экспорта */}
            <DataImportExport />

            <TechnologySearch 
                onSearchResults={handleSearchResults}
                onSearchStateChange={handleSearchStateChange}
            />

            <RoadmapImporter />
            {/* Показываем результаты поиска или локальные технологии */}
            <div className="search-results-info">
                {apiSearchResults && (
                    <div className="api-results-header">
                        <h3> Результаты поиска в базе знаний</h3>
                        <button 
                            onClick={() => setApiSearchResults(null)}
                            className="btn btn-secondary"
                        >
                            ← Вернуться к моим технологиям
                        </button>
                    </div>
                )}
                
                {searchState.loading && (
                    <div className="search-loading">
                         Поиск технологий...
                    </div>
                )}
                
                {searchState.error && (
                    <div className="search-error-global">
                         {searchState.error} !
                    </div>
                )}
            </div>

            <div className="filters">
                <button 
                    className={filter === 'all' ? 'active' : ''} 
                    onClick={() => setFilter('all')}
                >
                    Все
                </button>
                <button 
                    className={filter === 'not-started' ? 'active' : ''} 
                    onClick={() => setFilter('not-started')}
                >
                    Не начатые
                </button>
                <button 
                    className={filter === 'in-progress' ? 'active' : ''} 
                    onClick={() => setFilter('in-progress')}
                >
                    В процессе
                </button>
                <button 
                    className={filter === 'completed' ? 'active' : ''} 
                    onClick={() => setFilter('completed')}
                >
                    Завершенные
                </button>
            </div>

            <main className="technologies-container">
                <h2>
                    {apiSearchResults ? 'Найденные технологии' : 'Мои технологии'} 
                    ({filteredTechnologies.length})
                </h2>
                
                <div className="technologies-grid">
                    {filteredTechnologies.map(tech => (
                        <div key={tech.id} className="technology-card-wrapper">
                            <TechnologyCard
                                technology={tech}
                                onStatusChange={updateStatus}
                                onNotesChange={updateNotes}
                                onResourcesUpdate={handleResourcesUpdate}
                            />
                            {apiSearchResults && (
                                <button 
                                    onClick={() => handleAddFromSearch(tech)}
                                    className="btn-add-from-search"
                                >
                                     Добавить в трекер
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {filteredTechnologies.length === 0 && !searchState.loading && (
                    <div className="empty-state">
                        <p> Технологии не найдены</p>
                        {apiSearchResults ? (
                            <p>Попробуйте изменить поисковый запрос</p>
                        ) : (
                            <>
                                <p>Добавьте технологии вручную через страницу "Добавить технологию"</p>
                                <Link to="/add-technology" className="btn btn-primary">
                                     Добавить технологию
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

function App() {
    return (
        <Router basename="/reactProjectUni">
            <div className="App">
                <Navigation />
                
                <header className="App-header">
                    <h1> Трекер изучения технологий</h1>
                    <p>Прогресс в изучении React и связанных технологий</p>
                </header>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/technology/:techId" element={<TechnologyDetail />} />
                    <Route path="/technology/:techId/edit" element={<EditTechnology />} />
                    <Route path="/add-technology" element={<AddTechnology />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;