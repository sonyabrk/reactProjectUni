import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import ProgressBar from './components/ProgressBar';
import useTechnologies from './hooks/useTechnologies';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';

function HomePage() {
    const {
        technologies,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses
    } = useTechnologies();

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const randomizeNextTechnology = () => {
        const notStarted = technologies.filter(tech => tech.status === 'not-started');
        if (notStarted.length > 0) {
            const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
            updateStatus(randomTech.id, 'in-progress');
        }
    };

    const filteredTechnologies = technologies.filter(tech => {
        const matchesSearch = searchQuery === '' || 
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filter === 'all' || tech.status === filter;
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                markAllAsCompleted={markAllAsCompleted}
                resetAllStatuses={resetAllStatuses}
                randomizeNextTechnology={randomizeNextTechnology}
                technologies={technologies}
            />

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск технологий..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="search-results">
                        Найдено: {filteredTechnologies.length}
                    </span>
                </div>
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
                <h2>Карта технологий ({filteredTechnologies.length})</h2>
                <div className="technologies-grid">
                    {filteredTechnologies.map(tech => (
                        <TechnologyCard
                            key={tech.id}
                            technology={tech}
                            onStatusChange={updateStatus}
                            onNotesChange={updateNotes}
                        />
                    ))}
                </div>
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
                    <h1>Трекер изучения технологий</h1>
                    <p>Прогресс в изучении React и связанных технологий</p>
                </header>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/technology/:techId" element={<TechnologyDetail />} />
                    <Route path="/add-technology" element={<AddTechnology />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* Добавьте fallback маршрут для всех остальных путей */}
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;