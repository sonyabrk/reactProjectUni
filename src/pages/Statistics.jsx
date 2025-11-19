import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import './Statistics.css';

// Выносим функцию расчета статистики вне компонента
const calculateStats = (techData) => {
    if (!techData || techData.length === 0) {
        return {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            completionRate: 0,
            byCategory: {}
        };
    }

    const total = techData.length;
    const completed = techData.filter(tech => tech.status === 'completed').length;
    const inProgress = techData.filter(tech => tech.status === 'in-progress').length;
    const notStarted = techData.filter(tech => tech.status === 'not-started').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Статистика по категориям
    const byCategory = {};
    techData.forEach(tech => {
        if (!byCategory[tech.category]) {
            byCategory[tech.category] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
        }
        byCategory[tech.category].total++;
        byCategory[tech.category][tech.status]++;
    });

    return {
        total,
        completed,
        inProgress,
        notStarted,
        completionRate,
        byCategory
    };
};

function Statistics() {
    // Используем ленивую инициализацию вместо useEffect
    const [stats] = useState(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techData = JSON.parse(saved);
            return calculateStats(techData);
        }
        return {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            completionRate: 0,
            byCategory: {}
        };
    });

    const getCategoryProgress = (category) => {
        if (!stats.byCategory[category] || stats.byCategory[category].total === 0) return 0;
        return Math.round((stats.byCategory[category].completed / stats.byCategory[category].total) * 100);
    };

    return (
        <div className="statistics-page">
            <div className="page-header">
                <h1>Статистика изучения</h1>
                <p>Обзор вашего прогресса в изучении технологий</p>
            </div>

            {/* Основная статистика */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Всего технологий</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.completed}</div>
                    <div className="stat-label">Изучено</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.inProgress}</div>
                    <div className="stat-label">В процессе</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.notStarted}</div>
                    <div className="stat-label">Не начато</div>
                </div>
            </div>

            <div className="progress-section">
                <h2>Общий прогресс</h2>
                <ProgressBar
                    progress={stats.completionRate}
                    label="Общий процент завершения"
                    color="#4CAF50"
                    animated={true}
                    height={30}
                />
            </div>

            <div className="category-progress">
                <h2>Прогресс по категориям</h2>
                <div className="category-bars">
                    {Object.keys(stats.byCategory).map(category => (
                        <div key={category} className="category-item">
                            <div className="category-header">
                                <span className="category-name">
                                    {category === 'frontend' ? ' Фронтенд' : ' Бэкенд'}
                                </span>
                                <span className="category-stats">
                                    {stats.byCategory[category].completed}/
                                    {stats.byCategory[category].total}
                                </span>
                            </div>
                            <ProgressBar
                                progress={getCategoryProgress(category)}
                                height={20}
                                color={category === 'frontend' ? '#2196F3' : '#FF9800'}
                                showPercentage={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="status-distribution">
                <h2>Распределение по статусам</h2>
                <div className="distribution-chart">
                    {stats.total > 0 ? (
                        <>
                            <div className="chart-bar completed" style={{ width: `${(stats.completed / stats.total) * 100}%` }}>
                                <span>Изучено ({stats.completed})</span>
                            </div>
                            <div className="chart-bar in-progress" style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}>
                                <span>В процессе ({stats.inProgress})</span>
                            </div>
                            <div className="chart-bar not-started" style={{ width: `${(stats.notStarted / stats.total) * 100}%` }}>
                                <span>Не начато ({stats.notStarted})</span>
                            </div>
                        </>
                    ) : (
                        <div className="chart-bar empty">
                            <span>Нет данных для отображения</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="quick-stats-actions">
                <Link to="/" className="btn btn-primary">
                    ← Назад к трекеру
                </Link>
            </div>
        </div>
    );
}

export default Statistics;