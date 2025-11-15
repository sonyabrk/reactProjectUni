import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
    const handleCardClick = () => {
        onStatusChange(id);
    };

    const handleNotesChange = (e) => {
        onNotesChange(id, e.target.value);
    };

    return (
        <div className={`technology-card ${status}`} onClick={handleCardClick}>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
                
                <div className="notes-section">
                    <h4>Мои заметки:</h4>
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

                <div className="card-status">
                    <span className={`status-indicator ${status}`}>
                        {getStatusText(status)}
                    </span>
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