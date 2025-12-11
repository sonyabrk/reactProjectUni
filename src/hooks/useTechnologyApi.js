// src/hooks/useTechnologyApi.js
import { useState, useCallback } from 'react';

// Загружаем данные из JSON файла
let apiTechnologiesData = null;

const loadTechnologiesData = async () => {
  if (apiTechnologiesData) return apiTechnologiesData;
  
  try {
    const response = await fetch('/data/technologies.json');
    if (!response.ok) throw new Error('Failed to load technologies data');
    apiTechnologiesData = await response.json();
    return apiTechnologiesData;
  } catch (error) {
    console.error('Error loading technologies data:', error);
    // Возвращаем fallback данные если файл не найден
    return [
      {
        id: 1,
        title: 'React',
        description: 'Библиотека для создания пользовательских интерфейсов',
        category: 'frontend',
        status: 'not-started',
        difficulty: 'beginner',
        resources: ['https://react.dev', 'https://ru.reactjs.org'],
        notes: '',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Node.js',
        description: 'Среда выполнения JavaScript на сервере',
        category: 'backend',
        status: 'not-started',
        difficulty: 'intermediate',
        resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
        notes: '',
        createdAt: new Date().toISOString()
      }
    ];
  }
};

// Имитация API вызовов с задержкой (БЕЗ случайных ошибок)
const simulateApiCall = (data, delay = 300) => 
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });

function useTechnologiesApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка технологий из API
  const fetchTechnologies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const technologies = await loadTechnologiesData();
      return await simulateApiCall(technologies);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Ошибка загрузки технологий:', err);
      // Возвращаем пустой массив вместо выбрасывания ошибки
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Поиск технологий
  const searchTechnologies = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const technologies = await loadTechnologiesData();
      await simulateApiCall(null, 200); // Короткая задержка для реализма
      
      if (!query.trim()) {
        return technologies;
      }

      const filtered = technologies.filter(tech =>
        tech.title.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase()) ||
        (tech.category && tech.category.toLowerCase().includes(query.toLowerCase())) ||
        (tech.difficulty && tech.difficulty.toLowerCase().includes(query.toLowerCase()))
      );
      
      return filtered;
    } catch (err) {
      setError('Ошибка поиска');
      console.error('Ошибка поиска технологий:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка дополнительных ресурсов для технологии
  const fetchTechnologyResources = useCallback(async (techId) => {
    setLoading(true);
    setError(null);
    try {
      const technologies = await loadTechnologiesData();
      const tech = technologies.find(t => t.id === techId);
      if (tech) {
        const resources = await simulateApiCall(tech.resources || [], 200);
        return resources;
      } else {
        setError('Технология не найдена');
        return [];
      }
    } catch (err) {
      setError('Ошибка загрузки ресурсов');
      console.error('Ошибка загрузки ресурсов:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка дорожной карты
  const fetchRoadmap = useCallback(async (roadmapType = 'frontend') => {
    setLoading(true);
    setError(null);
    try {
      const technologies = await loadTechnologiesData();
      const roadmapData = {
        frontend: technologies.filter(tech => tech.category === 'frontend'),
        backend: technologies.filter(tech => tech.category === 'backend'),
        fullstack: technologies
      };

      const roadmap = await simulateApiCall(roadmapData[roadmapType] || roadmapData.fullstack);
      return roadmap;
    } catch (err) {
      setError('Ошибка загрузки дорожной карты');
      console.error('Ошибка загрузки roadmap:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchTechnologies,
    searchTechnologies,
    fetchTechnologyResources,
    fetchRoadmap
  };
}

export default useTechnologiesApi;