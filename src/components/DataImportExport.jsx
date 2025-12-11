import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './DataImportExport.css';

function DataImportExport() {
    const { technologies, setTechnologies } = useTechnologies();
    const [status, setStatus] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const exportToJSON = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('Данные экспортированы в JSON');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Ошибка экспорта данных');
            console.error('Ошибка экспорта:', error);
        }
    };

    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Проверяем размер файла (макс 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setStatus('Файл слишком большой (максимум 5MB)');
            setTimeout(() => setStatus(''), 3000);
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                if (!Array.isArray(imported)) {
                    throw new Error('Неверный формат данных. Ожидается массив.');
                }

                // Валидация импортированных данных
                const isValid = imported.every(item => 
                    item && 
                    typeof item.title === 'string' && 
                    typeof item.status === 'string'
                );

                if (!isValid) {
                    throw new Error('Неверная структура данных. Убедитесь что у всех элементов есть title и status.');
                }

                // Подтверждение импорта
                const confirmMessage = technologies.length > 0 
                    ? `Вы собираетесь импортировать ${imported.length} технологий.\n` +
                      `Текущие ${technologies.length} технологий будут заменены.\n\n` +
                      `Вы уверены?`
                    : `Импортировать ${imported.length} технологий?`;

                if (!window.confirm(confirmMessage)) {
                    setStatus('Импорт отменен');
                    setTimeout(() => setStatus(''), 3000);
                    return;
                }

                // Используем setTechnologies
                setTechnologies(imported);
                setStatus(`Импортировано ${imported.length} технологий`);
                setTimeout(() => setStatus(''), 3000);
            } catch (error) {
                setStatus(`Ошибка импорта: ${error.message}`);
                console.error('Ошибка импорта:', error);
            }
        };

        reader.onerror = () => {
            setStatus('Ошибка чтения файла');
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json'))) {
            // Создаем имитацию события input для использования той же логики
            const fakeEvent = {
                target: {
                    files: [file]
                }
            };
            importFromJSON(fakeEvent);
        } else {
            setStatus('Пожалуйста, выберите JSON файл (.json)');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="data-import-export">
            <h3>Импорт и экспорт данных</h3>

            {status && (
                <div className={`status-message ${status.includes('❌') ? 'error' : 'success'}`}>
                    {status}
                </div>
            )}

            <div className="controls">
                <button 
                    onClick={exportToJSON} 
                    disabled={technologies.length === 0}
                    className="btn-export"
                    title="Экспортировать все технологии в JSON файл"
                >
                    Экспорт в JSON
                </button>

                <label className="file-input-label">
                    Импорт из JSON
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={importFromJSON}
                    />
                </label>
            </div>

            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="drop-icon"></div>
                <div className="drop-text">Перетащите JSON-файл сюда</div>
                <div className="drop-hint">или выберите файл для импорта</div>
            </div>

            {technologies.length > 0 && (
                <div className="technologies-preview">
                    <h4>Текущие технологии ({technologies.length})</h4>
                    <div className="preview-list">
                        {technologies.slice(0, 5).map((tech, index) => (
                            <div key={tech.id || index} className="preview-item">
                                <strong>{tech.title}</strong>
                                <span className="preview-category"> - {tech.category || 'без категории'}</span>
                                <span className={`preview-status ${tech.status}`}>
                                    {tech.status === 'completed' ? '✅' : 
                                     tech.status === 'in-progress' ? '⏳' : '⏸️'}
                                </span>
                            </div>
                        ))}
                        {technologies.length > 5 && (
                            <div className="preview-more">
                                ... и еще {technologies.length - 5} технологий
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataImportExport;