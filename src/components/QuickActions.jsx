import { useState } from 'react';
import Modal from './Modal';
import BulkStatusEdit from './BulkStatusEdit';
import DataImportExport from './DataImportExport';
import './QuickActions.css';

function QuickActions({ 
    markAllAsCompleted, 
    resetAllStatuses, 
    randomizeNextTechnology, 
    technologies,
    onBulkUpdate 
}) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showBulkEditModal, setShowBulkEditModal] = useState(false);
    const [showImportExportModal, setShowImportExportModal] = useState(false);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        
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

    const handleBulkUpdate = (ids, newStatus) => {
        if (onBulkUpdate) {
            onBulkUpdate(ids, newStatus);
        }
        setShowBulkEditModal(false);
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
                <button onClick={() => setShowBulkEditModal(true)} className="btn btn-bulk">
                    Массовое редактирование
                </button>
                <button onClick={handleExport} className="btn btn-export">
                    Экспорт данных
                </button>
                <button onClick={() => setShowImportExportModal(true)} className="btn btn-import">
                    Импорт данных
                </button>
            </div>

            {/* Модальное окно экспорта */}
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

            {/* Модальное окно массового редактирования */}
            <Modal
                isOpen={showBulkEditModal}
                onClose={() => setShowBulkEditModal(false)}
                title="Массовое редактирование статусов"
                size="large"
            >
                <BulkStatusEdit 
                    technologies={technologies}
                    onBulkUpdate={handleBulkUpdate}
                />
            </Modal>

            {/* Модальное окно импорта/экспорта */}
            <Modal
                isOpen={showImportExportModal}
                onClose={() => setShowImportExportModal(false)}
                title="Импорт / экспорт данных"
                size="large"
            >
                <DataImportExport />
            </Modal>
        </div>
    );
}

export default QuickActions;