import { useState, useEffect } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';

const initialTechnologies = [
    { 
        id: 1, 
        title: 'React Components', 
        description: 'Изучение функциональных и классовых компонентов', 
        status: 'not-started',
        notes: ''
    },
    { 
        id: 2, 
        title: 'JSX Syntax', 
        description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке', 
        status: 'not-started',
        notes: ''
    },
    { 
        id: 3, 
        title: 'State Management', 
        description: 'Работа с состоянием компонентов, использование useState и useContext', 
        status: 'not-started',
        notes: ''
    },
    { 
        id: 4, 
        title: 'Props', 
        description: 'Передача данных между компонентами через props', 
        status: 'not-started',
        notes: ''
    },
    { 
        id: 5, 
        title: 'Event Handling', 
        description: 'Обработка событий в React', 
        status: 'not-started',
        notes: ''
    },
    { 
        id: 6, 
        title: 'React Hooks', 
        description: 'Изучение основных хуков: useEffect, useMemo, useCallback, создание кастомных хуков', 
        status: 'not-started',
        notes: ''
    }
];

function App() {
    const [technologies, setTechnologies] = useState(() => {
        const saved = localStorage.getItem('techTrackerData');
        if (saved) {
            console.log('Данные загружены из localStorage');
            return JSON.parse(saved);
        }
        console.log('Используются начальные данные');
        return initialTechnologies;
    });

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('techTrackerData', JSON.stringify(technologies));
        console.log('Данные сохранены в localStorage');
    }, [technologies]);

    const updateTechnologyStatus = (id) => {
        setTechnologies(prevTech => prevTech.map(tech => {
            if (tech.id === id) {
                const statusOrder = ['not-started', 'in-progress', 'completed'];
                const currentIndex = statusOrder.indexOf(tech.status);
                const nextIndex = (currentIndex + 1) % statusOrder.length;
                return { ...tech, status: statusOrder[nextIndex] };
            }
            return tech;
        }));
    };

    const updateTechnologyNotes = (techId, newNotes) => {
        setTechnologies(prevTech =>
            prevTech.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    const markAllAsCompleted = () => {
        setTechnologies(prevTech => prevTech.map(tech => ({ ...tech, status: 'completed' })));
    };

    const resetAllStatuses = () => {
        setTechnologies(prevTech => prevTech.map(tech => ({ ...tech, status: 'not-started' })));
    };

    const randomizeNextTechnology = () => {
        const notStarted = technologies.filter(tech => tech.status === 'not-started');
        if (notStarted.length > 0) {
            const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
            updateTechnologyStatus(randomTech.id);
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
        <div className="App">
            <header className="App-header">
                <h1>Трекер изучения технологий</h1>
                <p>Прогресс в изучении React и связанных технологий</p>
            </header>

            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                markAllAsCompleted={markAllAsCompleted}
                resetAllStatuses={resetAllStatuses}
                randomizeNextTechnology={randomizeNextTechnology}
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
                            id={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                            notes={tech.notes}
                            onStatusChange={updateTechnologyStatus}
                            onNotesChange={updateTechnologyNotes}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;