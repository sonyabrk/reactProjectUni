import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ markAllAsCompleted, resetAllStatuses, randomizeNextTechnology, technologies }) {
    const [showExportModal, setShowExportModal] = useState(false);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        
        // Создаем Blob и ссылку для скачивания
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShowExportModal(true);
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button onClick={markAllAsCompleted} className="btn btn-success">
                    Отметить все как выполненные
                </button>
                <button onClick={resetAllStatuses} className="btn btn-warning">
                    Сбросить все статусы
                </button>
                <button onClick={randomizeNextTechnology} className="btn btn-info">
                    Случайный выбор следующей технологии
                </button>
                <button onClick={handleExport} className="btn btn-export">
                    Экспорт данных
                </button>
            </div>

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <p>Данные успешно экспортированы!</p>
                <p>Файл с вашими данными был скачан автоматически.</p>
                <button 
                    onClick={() => setShowExportModal(false)}
                    className="btn btn-primary"
                >
                    Закрыть
                </button>
            </Modal>
        </div>
    );
}

export default QuickActions;