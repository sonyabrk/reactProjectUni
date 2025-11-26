// src/hooks/useTechnologies.js
import { useState, useEffect } from 'react';

function useTechnologies() {
    const [technologies, setTechnologies] = useState([]);

    // Функция для загрузки технологий
    const loadTechnologies = () => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            // Используем setTimeout для асинхронного обновления состояния
            setTimeout(() => {
                setTechnologies(JSON.parse(saved));
            }, 0);
        }
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        loadTechnologies();
    }, []);

    // Слушаем изменения в localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            loadTechnologies();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('technologiesUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('technologiesUpdated', handleStorageChange);
        };
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const updateNotes = (id, newNotes) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, notes: newNotes } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const markAllAsCompleted = () => {
        const updated = technologies.map(tech => ({ ...tech, status: 'completed' }));
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const resetAllStatuses = () => {
        const updated = technologies.map(tech => ({ ...tech, status: 'not-started' }));
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses,
        loadTechnologies
    };
}

export default useTechnologies;