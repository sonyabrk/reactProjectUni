import { Link } from 'react-router-dom';
import TechnologyResources from './TechnologyResources';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange, onNotesChange, onResourcesUpdate }) {
    const { id, title, description, status, notes } = technology;

    const handleCardClick = () => {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        onStatusChange(id, statusOrder[nextIndex]);
    };

    const handleNotesChange = (e) => {
        onNotesChange(id, e.target.value);
    };

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