import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TechnologyForm from '../components/TechnologyForm';
import useTechnologies from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const { addTechnology } = useTechnologies();

    const handleSave = async (techData) => {
        try {
            await addTechnology(techData);
            // Навигация произойдет после успешного сохранения в форме
        } catch (error) {
            console.error('Ошибка при добавлении технологии:', error);
            throw error; // Пробрасываем ошибку обратно в форму
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="add-technology-page">
            <div className="page-header">
                <Link to="/" className="back-link">
                    Назад к списку
                </Link>
            </div>

            <TechnologyForm 
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default AddTechnology;