import { Link } from 'react-router-dom';
import TechnologyResources from './TechnologyResources';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange, onNotesChange, onResourcesUpdate }) {
    const { id, title, description, status, notes, deadline } = technology;

    const handleCardClick = () => {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        onStatusChange(id, statusOrder[nextIndex]);
    };

    const handleNotesChange = (e) => {
        onNotesChange(id, e.target.value);
    };

    // Функция для расчета статуса дедлайна
    const getDeadlineStatus = () => {
        if (!deadline) return null;
        
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: 'Просрочено', className: 'deadline-overdue' };
        if (diffDays <= 3) return { text: `Осталось ${diffDays} дня`, className: 'deadline-critical' };
        if (diffDays <= 7) return { text: `Осталось ${diffDays} дней`, className: 'deadline-warning' };
        return { text: `Осталось ${diffDays} дней`, className: 'deadline-ok' };
    };

    const deadlineStatus = getDeadlineStatus();

    return (
        <div className={`technology-card ${status}`}>
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    <Link to={`/technology/${id}`} className="detail-link">
                        Подробнее 
                    </Link>
                </div>
                
                <p className="card-description">{description}</p>
                
                {/* Блок с дедлайном */}
                {deadline && deadlineStatus && (
                    <div className={`deadline-section ${deadlineStatus.className}`}>
                        <div className="deadline-info">
                            <span className="deadline-label">Дедлайн:</span>
                            <span className="deadline-date">
                                {new Date(deadline).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="deadline-status">
                            {deadlineStatus.text}
                        </div>
                    </div>
                )}

                <div className="notes-section">
                    <h4>Заметки:</h4>
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        onClick={(e) => e.stopPropagation()} 
                        placeholder="Записывайте сюда важные моменты..."
                        rows="3"
                    />
                    <div className="notes-hint">
                        {notes.length > 0 ? `Заметка сохранена (${notes.length} символов)` : 'Добавьте заметку'}
                    </div>
                </div>

                <TechnologyResources 
                    technology={technology}
                    onResourcesUpdate={onResourcesUpdate}
                />

                <div className="card-footer">
                    <div className="card-status">
                        <span className={`status-indicator ${status}`}>
                            {getStatusText(status)}
                        </span>
                    </div>
                    <button 
                        className="status-toggle-btn"
                        onClick={handleCardClick}
                    >
                        Сменить статус
                    </button>
                </div>
            </div>
        </div>
    );
}

function getStatusText(status) {
    switch (status) {
        case 'completed':
            return 'Изучено';
        case 'in-progress':
            return 'В процессе';
        case 'not-started':
            return 'Не начато';
        default:
            return status;
    }
}

export default TechnologyCard;