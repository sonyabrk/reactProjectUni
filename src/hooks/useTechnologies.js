// src/hooks/useTechnologies.js
import { useState, useEffect } from 'react';

function useTechnologies() {
    // Используем ленивую инициализацию для начальной загрузки
    const [technologies, setTechnologies] = useState(() => {
        const saved = localStorage.getItem('technologies');
        return saved ? JSON.parse(saved) : [];
    });

    // Слушаем изменения в localStorage только для синхронизации между вкладками
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'technologies') {
                const saved = localStorage.getItem('technologies');
                if (saved) {
                    // Используем requestAnimationFrame для асинхронного обновления
                    requestAnimationFrame(() => {
                        setTechnologies(JSON.parse(saved));
                    });
                }
            }
        };

        const handleCustomEvent = () => {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                requestAnimationFrame(() => {
                    setTechnologies(JSON.parse(saved));
                });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('technologiesUpdated', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('technologiesUpdated', handleCustomEvent);
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

    const updateTechnologyResources = (id, newResources) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, resources: newResources } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const addTechnology = (techData) => {
        const newTechnology = {
            ...techData,
            id: Date.now(),
            status: techData.status || 'not-started',
            notes: techData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updated = [...technologies, newTechnology];
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
        
        return newTechnology;
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
        updateTechnologyResources,
        addTechnology,
        markAllAsCompleted,
        resetAllStatuses
    };
}

export default useTechnologies;