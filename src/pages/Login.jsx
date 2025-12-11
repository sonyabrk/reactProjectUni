import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Имитация задержки API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Простая проверка - в реальном приложении здесь был бы запрос к API
            if (username === 'admin' && password === 'password') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // Вызываем колбэк для обновления состояния в App
                onLogin(username);
                
                // Перенаправляем на главную
                navigate('/');
            } else if (username === 'user' && password === 'password') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                onLogin(username);
                navigate('/');
            } else {
                setError('Неверное имя пользователя или пароль');
            }
        } catch (err) {
            setError('Ошибка при входе в систему');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setUsername('admin');
        setPassword('password');
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box className="login-page">
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Вход в систему
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                            Используйте логин: <strong>admin</strong> и пароль: <strong>password</strong> для демо-входа
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal"
                                required
                                disabled={loading}
                            />
                            
                            <TextField
                                fullWidth
                                label="Пароль"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                disabled={loading}
                            />

                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading ? 'Вход...' : 'Войти'}
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={handleDemoLogin}
                                    disabled={loading}
                                >
                                    Использовать демо-аккаунт
                                </Button>
                            </Box>
                        </form>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Тестовые учетные записи:
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                • Админ: admin / password<br />
                                • Пользователь: user / password
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Link to="/" className="link">
                                ← Назад на главную
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default Login;