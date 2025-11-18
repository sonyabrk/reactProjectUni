import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
    { 
        id: 1, 
        title: 'React Components', 
        description: 'Изучение функциональных и классовых компонентов', 
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    { 
        id: 2, 
        title: 'JSX Syntax', 
        description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке', 
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    { 
        id: 3, 
        title: 'State Management', 
        description: 'Работа с состоянием компонентов, использование useState и useContext', 
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    { 
        id: 4, 
        title: 'Node.js Basics', 
        description: 'Основы серверного JavaScript', 
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    { 
        id: 5, 
        title: 'Express Framework', 
        description: 'Создание REST API с помощью Express', 
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    { 
        id: 6, 
        title: 'Database Integration', 
        description: 'Работа с базами данных (MongoDB, PostgreSQL)', 
        status: 'not-started',
        notes: '',
        category: 'backend'
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    const markAllAsCompleted = () => {
        setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'completed' })));
    };

    const resetAllStatuses = () => {
        setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'not-started' })));
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses,
        progress: calculateProgress()
    };
}

export default useTechnologies;