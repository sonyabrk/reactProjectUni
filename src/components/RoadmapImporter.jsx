// src/components/RoadmapImporter.jsx
import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologyApi';
import useTechnologies from '../hooks/useTechnologies';
import './RoadmapImporter.css';

function RoadmapImporter() {
  const { fetchRoadmap, loading, error } = useTechnologiesApi();
  const { technologies, addTechnology } = useTechnologies();
  const [importedCount, setImportedCount] = useState(0);
  const [selectedRoadmap, setSelectedRoadmap] = useState('frontend');

  const handleImportRoadmap = async () => {
    try {
      const roadmapTechnologies = await fetchRoadmap(selectedRoadmap);
      
      let count = 0;
      for (const tech of roadmapTechnologies) {
        // Проверяем, нет ли уже такой технологии
        const exists = technologies.some(existingTech => 
          existingTech.title === tech.title
        );
        
        if (!exists) {
          await addTechnology(tech);
          count++;
        }
      }
      
      setImportedCount(count);
      
      if (count > 0) {
        alert(`Успешно импортировано ${count} технологий из дорожной карты!`);
      } else {
        alert('Все технологии из этой дорожной карты уже есть в вашем списке.');
      }
    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожной карты</h3>
      <p>Загрузите готовый набор технологий для изучения</p>
      
      <div className="roadmap-selection">
        <label htmlFor="roadmap-type">Выберите дорожную карту:</label>
        <select
          id="roadmap-type"
          value={selectedRoadmap}
          onChange={(e) => setSelectedRoadmap(e.target.value)}
          disabled={loading}
        >
          <option value="frontend">Фронтенд разработка</option>
          <option value="backend">Бэкенд разработка</option>
          <option value="fullstack">Fullstack разработка</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
           {error} !
        </div>
      )}

      <button 
        onClick={handleImportRoadmap} 
        disabled={loading}
        className="btn btn-import"
      >
        {loading ? ' Импорт...' : ' Импортировать дорожную карту'}
      </button>

      {importedCount > 0 && (
        <div className="import-success">
           Успешно импортировано технологий: {importedCount}
        </div>
      )}

      <div className="roadmap-info">
        <h4>Что включено в дорожные карты:</h4>
        <ul>
          <li><strong>Фронтенд:</strong> React, TypeScript и related technologies</li>
          <li><strong>Бэкенд:</strong> Node.js, MongoDB и server-side technologies</li>
          <li><strong>Fullstack:</strong> Все технологии из обеих дорожных карт</li>
        </ul>
      </div>
    </div>
  );
}

export default RoadmapImporter;