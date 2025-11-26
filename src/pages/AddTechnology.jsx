import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Пожалуйста, введите название технологии');
            return;
        }

        const saved = localStorage.getItem('technologies');
        const technologies = saved ? JSON.parse(saved) : [];

        const newTechnology = {
            id: Date.now(), 
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedTechnologies = [...technologies, newTechnology];
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));

        alert('Технология успешно добавлена!');
        navigate('/');
    };

    return (
        <div className="add-technology-page">
            <div className="page-header">
                <Link to="/" className="back-link">
                    Назад к списку
                </Link>
                <h1>Добавить новую технологию</h1>
            </div>

            <form onSubmit={handleSubmit} className="technology-form">
                <div className="form-section">
                    <h3>Основная информация</h3>
                    
                    <div className="form-group">
                        <label htmlFor="title">Название технологии *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Angular, Vue.js, React...."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Краткое описание технологии"
                            rows="4"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="category">Категория</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="frontend">Фронтенд разработка</option>
                            <option value="backend">Бэкенд разработка</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Статус изучения</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Изучено</option>
                        </select>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Доп. информация</h3>
                    
                    <div className="form-group">
                        <label htmlFor="notes">Заметки</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Заметки"
                            rows="6"
                        />
                        <div className="notes-hint">
                            {formData.notes.length}/1000 символов
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-large">
                        Добавить технологию
                    </button>
                    <Link to="/" className="btn btn-secondary">
                        Отмена
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;