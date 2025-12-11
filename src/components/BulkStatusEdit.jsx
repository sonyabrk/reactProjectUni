import { useState, useEffect } from 'react';
import './BulkStatusEdit.css';

function BulkStatusEdit({ technologies, onBulkUpdate, onClose }) {
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [newStatus, setNewStatus] = useState('not-started');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    // Синхронизируем выбор всех
    useEffect(() => {
        if (selectAll) {
            setSelectedTechs(technologies.map(tech => tech.id));
        } else if (selectedTechs.length === technologies.length) {
            setSelectAll(true);
        }
    }, [selectAll, technologies, selectedTechs.length]);

    const handleTechSelection = (techId, isSelected) => {
        if (isSelected) {
            setSelectedTechs(prev => [...prev, techId]);
        } else {
            setSelectedTechs(prev => prev.filter(id => id !== techId));
            setSelectAll(false);
        }
    };

    const handleSelectAll = () => {
        if (!selectAll) {
            setSelectedTechs(technologies.map(tech => tech.id));
        } else {
            setSelectedTechs([]);
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedTechs.length === 0) {
            alert('Выберите хотя бы одну технологию');
            return;
        }

        setIsSubmitting(true);
        
        try {
            await onBulkUpdate(selectedTechs, newStatus);
            setSelectedTechs([]);
            setSelectAll(false);
            if (onClose) onClose();
        } catch (error) {
            console.error('Ошибка при массовом обновлении:', error);
            alert('Произошла ошибка при обновлении статусов');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    return (
        <div className="bulk-status-edit">
            <h3>Массовое редактирование статусов</h3>
            
            <div className="bulk-controls">
                <div className="selection-info">
                    <span>Выбрано: {selectedTechs.length} из {technologies.length} технологий</span>
                    {technologies.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="btn-select-all"
                        >
                            {selectAll ? 'Снять все' : 'Выбрать все'}
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="bulk-form">
                    <div className="form-group">
                        <label htmlFor="bulk-status">Установить статус:</label>
                        <select
                            id="bulk-status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            aria-required="true"
                            className="status-select"
                        >
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                    </div>

                    <div className="action-buttons">
                        <button
                            type="submit"
                            disabled={selectedTechs.length === 0 || isSubmitting}
                            className="btn-apply"
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? 'Применение...' : `Применить к ${selectedTechs.length} технологиям`}
                        </button>
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-cancel"
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="technologies-list">
                <h4>Список технологий:</h4>
                <div className="tech-checkboxes">
                    {technologies.map(tech => (
                        <div key={tech.id} className="tech-checkbox-item">
                            <input
                                type="checkbox"
                                id={`tech-${tech.id}`}
                                checked={selectedTechs.includes(tech.id)}
                                onChange={(e) => handleTechSelection(tech.id, e.target.checked)}
                                className="tech-checkbox"
                            />
                            <label htmlFor={`tech-${tech.id}`} className="tech-label">
                                <div className="tech-info">
                                    <span className="tech-title">{tech.title}</span>
                                    <div className="tech-details">
                                        <span className={`tech-status ${tech.status}`}>
                                            {getStatusText(tech.status)}
                                        </span>
                                        {tech.deadline && (
                                            <span className="tech-deadline">
                                                {new Date(tech.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {technologies.length === 0 && (
                <div className="empty-state">
                    <p>Технологии не найдены</p>
                    <p>Добавьте технологии для массового редактирования</p>
                </div>
            )}
        </div>
    );
}

export default BulkStatusEdit;