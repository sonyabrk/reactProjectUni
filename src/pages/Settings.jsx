import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const [settings, setSettings] = useState(() => {
        // Используем ленивую инициализацию вместо useEffect
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings 
            ? JSON.parse(savedSettings)
            : {
                theme: 'light',
                language: 'ru',
                notifications: true,
                autoSave: true
            };
    });
    
    const [showResetModal, setShowResetModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    const resetAllData = () => {
        localStorage.removeItem('technologies');
        localStorage.removeItem('appSettings');
        setSettings({
            theme: 'light',
            language: 'ru',
            notifications: true,
            autoSave: true
        });
        setShowResetModal(false);
        alert('Все данные были сброшены!');
    };

    const exportData = () => {
        const technologies = localStorage.getItem('technologies');
        const appSettings = localStorage.getItem('appSettings');
        
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies ? JSON.parse(technologies) : [],
            settings: appSettings ? JSON.parse(appSettings) : {}
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShowExportModal(true);
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.technologies) {
                    localStorage.setItem('technologies', JSON.stringify(data.technologies));
                }
                
                if (data.settings) {
                    localStorage.setItem('appSettings', JSON.stringify(data.settings));
                    setSettings(data.settings);
                }
                
                alert('Данные успешно импортированы!');
                event.target.value = ''; 
            } catch (error) {
                alert('Ошибка при импорте данных: неверный формат файла');
                console.log(error);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Настройки приложения</h1>
                <p>Управление настройками и данными трекера</p>
            </div>

            <div className="settings-sections">
                {/* Настройки внешнего вида */}
                <section className="settings-section">
                    <h2>Внешний вид</h2>
                    <div className="setting-group">
                        <label>Тема оформления:</label>
                        <select 
                            value={settings.theme}
                            onChange={(e) => updateSetting('theme', e.target.value)}
                        >
                            <option value="light">Светлая</option>
                            <option value="dark">Темная</option>
                            <option value="auto">Авто</option>
                        </select>
                    </div>
                    
                    <div className="setting-group">
                        <label>Язык интерфейса:</label>
                        <select 
                            value={settings.language}
                            onChange={(e) => updateSetting('language', e.target.value)}
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </section>

                {/* Настройки уведомлений */}
                <section className="settings-section">
                    <h2>Уведомления</h2>
                    <div className="setting-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => updateSetting('notifications', e.target.checked)}
                            />
                            Включить уведомления
                        </label>
                    </div>
                    
                    <div className="setting-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                            />
                            Автосохранение изменений
                        </label>
                    </div>
                </section>

                {/* Управление данными */}
                <section className="settings-section">
                    <h2>Управление данными</h2>
                    <div className="data-actions">
                        <button 
                            className="btn btn-export"
                            onClick={exportData}
                        >
                            Экспорт данных
                        </button>
                        
                        <div className="import-group">
                            <label htmlFor="import-file" className="btn btn-import">
                                Импорт данных
                            </label>
                            <input
                                id="import-file"
                                type="file"
                                accept=".json"
                                onChange={importData}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <button 
                            className="btn btn-danger"
                            onClick={() => setShowResetModal(true)}
                        >
                            Сбросить все данные
                        </button>
                    </div>
                </section>

                {/* Информация о приложении */}
                <section className="settings-section">
                    <h2>О приложении</h2>
                    <div className="app-info">
                        <p><strong>Версия:</strong> 1.0.0</p>
                        <p><strong>Разработчик:</strong> Трекер технологий</p>
                        <p><strong>Описание:</strong> Приложение для отслеживания прогресса изучения технологий</p>
                    </div>
                </section>
            </div>

            <div className="settings-actions">
                <Link to="/" className="btn btn-primary">
                    ← Назад к трекеру
                </Link>
            </div>

            {/* Модальное окно сброса данных */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Сброс всех данных"
            >
                <div className="reset-modal-content">
                    <p>Вы уверены, что хотите сбросить все данные?</p>
                    <p className="warning-text">
                        Это действие невозможно отменить. Все ваши технологии, прогресс и настройки будут удалены.
                    </p>
                    <div className="modal-actions">
                        <button 
                            className="btn btn-danger"
                            onClick={resetAllData}
                        >
                            Да, сбросить всё
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => setShowResetModal(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Модальное окно экспорта */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт завершен"
            >
                <div className="export-modal-content">
                    <p>Данные успешно экспортированы!</p>
                    <p>Файл с резервной копией был скачан на ваше устройство.</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowExportModal(false)}
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Settings;