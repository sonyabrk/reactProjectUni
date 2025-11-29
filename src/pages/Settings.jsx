import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Button,
  Alert,
  Grid,
  FormControlLabel // Добавляем этот импорт
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Dangerous as DangerousIcon
} from '@mui/icons-material';
import Modal from '../components/Modal';
import useNotification from '../hooks/useNotification';
import './Settings.css';

function Settings() {
    const [settings, setSettings] = useState(() => {
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
    const { showSuccess, showError } = useNotification();

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
        showSuccess('Настройка сохранена!');
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
        showSuccess('Все данные были сброшены!');
    };

    const exportData = () => {
        try {
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
            showSuccess('Данные успешно экспортированы!');
        } catch (error) {
            console.log(error);
            showError('Ошибка при экспорте данных!');
        }
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
                
                showSuccess('Данные успешно импортированы!');
                event.target.value = ''; 
            } catch (error) {
                console.log(error);
                showError('Ошибка при импорте данных: неверный формат файла');
            }
        };
        reader.readAsText(file);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box className="settings-page">
                <Box className="page-header" sx={{ mb: 4, textAlign: 'center' }}>
                    <SettingsIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        Настройки приложения
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Управление настройками и данными трекера
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Настройки внешнего вида */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Внешний вид
                                </Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Тема оформления</InputLabel>
                                    <Select 
                                        value={settings.theme}
                                        onChange={(e) => updateSetting('theme', e.target.value)}
                                        label="Тема оформления"
                                    >
                                        <MenuItem value="light">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LightIcon fontSize="small" />
                                                Светлая
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="dark">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <DarkIcon fontSize="small" />
                                                Темная
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="auto">Авто</MenuItem>
                                    </Select>
                                </FormControl>
                                
                                <FormControl fullWidth>
                                    <InputLabel>Язык интерфейса</InputLabel>
                                    <Select 
                                        value={settings.language}
                                        onChange={(e) => updateSetting('language', e.target.value)}
                                        label="Язык интерфейса"
                                    >
                                        <MenuItem value="ru">Русский</MenuItem>
                                        <MenuItem value="en">English</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Настройки уведомлений */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Уведомления
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications}
                                                onChange={(e) => updateSetting('notifications', e.target.checked)}
                                            />
                                        }
                                        label="Включить уведомления"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.autoSave}
                                                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                                            />
                                        }
                                        label="Автосохранение изменений"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Управление данными */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Управление данными
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button 
                                        variant="outlined"
                                        startIcon={<BackupIcon />}
                                        onClick={exportData}
                                    >
                                        Экспорт данных
                                    </Button>
                                    
                                    <Button 
                                        variant="outlined"
                                        component="label"
                                        startIcon={<RestoreIcon />}
                                    >
                                        Импорт данных
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={importData}
                                            style={{ display: 'none' }}
                                        />
                                    </Button>
                                    
                                    <Button 
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DangerousIcon />}
                                        onClick={() => setShowResetModal(true)}
                                    >
                                        Сбросить все данные
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Информация о приложении */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    О приложении
                                </Typography>
                                <Box className="app-info">
                                    <Typography><strong>Версия:</strong> 1.0.0</Typography>
                                    <Typography><strong>Разработчик:</strong> Трекер технологий</Typography>
                                    <Typography>
                                        <strong>Описание:</strong> Приложение для отслеживания прогресса изучения технологий
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box className="settings-actions" sx={{ mt: 4, textAlign: 'center' }}>
                    <Button 
                        component={Link} 
                        to="/" 
                        variant="contained"
                        size="large"
                    >
                        ← Назад к трекеру
                    </Button>
                </Box>
            </Box>

            {/* Модальное окно сброса данных */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Сброс всех данных"
            >
                <Box className="reset-modal-content">
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Вы уверены, что хотите сбросить все данные?
                    </Alert>
                    <Typography variant="body2" color="error" sx={{ mb: 3 }}>
                        Это действие невозможно отменить. Все ваши технологии, прогресс и настройки будут удалены.
                    </Typography>
                    <Box className="modal-actions" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button 
                            variant="contained"
                            color="error"
                            onClick={resetAllData}
                        >
                            Да, сбросить всё
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={() => setShowResetModal(false)}
                        >
                            Отмена
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Модальное окно экспорта */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт завершен"
            >
                <Box className="export-modal-content">
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Данные успешно экспортированы!
                    </Alert>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Файл с резервной копией был скачан на ваше устройство.
                    </Typography>
                    <Button 
                        variant="contained"
                        onClick={() => setShowExportModal(false)}
                        sx={{ width: '100%' }}
                    >
                        Закрыть
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Settings;