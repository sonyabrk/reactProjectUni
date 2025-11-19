import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
    { 
        id: 1, 
        title: 'React компоненты', 
        description: 'Изучение функциональных и классовых компонентов', 
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    { 
        id: 2, 
        title: 'State Management',
        description: 'Работа с состоянием компонентов, использование useState и useContext', 
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    { 
        id: 3, 
        title: 'JSX синтаксис', 
        description: 'Освоение синтаксиса JSX, работа с выражениями JavaScript в разметке', 
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    { 
        id: 4, 
        title: 'Node.js база', 
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
        title: 'Базы данных (PostreSQL)', 
        description: 'Работа с базами данных (MongoDB, PostgreSQL, SQLite)', 
        status: 'not-started',
        notes: '',
        category: 'backend'
    }
];

// Добавляем версию данных
const DATA_VERSION = '2.0';

function useTechnologies() {
    const [storage, setStorage] = useLocalStorage('tech_tracker_data', {
        version: DATA_VERSION,
        technologies: initialTechnologies
    });

    // Проверяем версию данных и мигрируем при необходимости
    const technologies = storage.version === DATA_VERSION 
        ? storage.technologies 
        : initialTechnologies;

    const setTechnologies = (newTechnologies) => {
        setStorage({
            version: DATA_VERSION,
            technologies: newTechnologies
        });
    };

    const updateStatus = (techId, newStatus) => {
        setTechnologies(
            technologies.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const updateNotes = (techId, newNotes) => {
        setTechnologies(
            technologies.map(tech =>
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
        setTechnologies(technologies.map(tech => ({ ...tech, status: 'completed' })));
    };

    const resetAllStatuses = () => {
        setTechnologies(technologies.map(tech => ({ ...tech, status: 'not-started' })));
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