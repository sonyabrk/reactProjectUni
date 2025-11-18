import ProgressBar from './ProgressBar';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    //const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-header">
            <h2>Детальная статистика прогресса</h2>
            
            <div className="progress-stats">
                <div className="stat-item">
                    <span className="stat-number">{total}</span>
                    <span className="stat-label">Всего технологий</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{completed}</span>
                    <span className="stat-label">Изучено</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{inProgress}</span>
                    <span className="stat-label">В процессе</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{notStarted}</span>
                    <span className="stat-label">Не начато</span>
                </div>
            </div>

            <div className="progress-bars-section">
                <h3>Прогресс по категориям</h3>
                
                <div className="category-progress">
                    <ProgressBar
                        progress={calculateCategoryProgress(technologies, 'frontend')}
                        label="Фронтенд разработка"
                        color="#4CAF50"
                        showPercentage={true}
                        height={18}
                    />
                </div>
                
                <div className="category-progress">
                    <ProgressBar
                        progress={calculateCategoryProgress(technologies, 'backend')}
                        label="Бэкенд разработка"
                        color="#FF9800"
                        showPercentage={true}
                        height={18}
                    />
                </div>
            </div>
        </div>
    );
}

function calculateCategoryProgress(technologies, category) {
    const categoryTechs = technologies.filter(tech => tech.category === category);
    if (categoryTechs.length === 0) return 0;
    const completed = categoryTechs.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / categoryTechs.length) * 100);
}

export default ProgressHeader;