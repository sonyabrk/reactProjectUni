import './QuickActions.css';

function QuickActions({ markAllAsCompleted, resetAllStatuses, randomizeNextTechnology }) {
    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button onClick={markAllAsCompleted}>Отметить все как выполненные</button>
                <button onClick={resetAllStatuses}>Сбросить все статусы</button>
                <button onClick={randomizeNextTechnology}>Случайный выбор следующей технологии</button>
            </div>
        </div>
    );
}

export default QuickActions;