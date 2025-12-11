import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    IconButton,
    useMediaQuery,
    Switch,
    FormControlLabel,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar
} from '@mui/material';
import {
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
    Menu as MenuIcon,
    Home as HomeIcon,
    Add as AddIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    AccountCircle
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import './Navigation.css';

function Navigation({ themeMode, onToggleTheme, onSetTheme, isLoggedIn, username, onLogout }) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const navItems = [
        { path: '/', label: 'Главная', icon: <HomeIcon />, show: true },
        { path: '/add-technology', label: 'Добавить технологию', icon: <AddIcon />, show: isLoggedIn },
        { path: '/statistics', label: 'Статистика', icon: <AnalyticsIcon />, show: isLoggedIn },
        { path: '/settings', label: 'Настройки', icon: <SettingsIcon />, show: isLoggedIn }
    ];

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMobileMenuClose();
    };

    const handleLogoutClick = () => {
        onLogout();
        handleMobileMenuClose();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const filteredNavItems = navItems.filter(item => item.show);

    // Исправлено: удалены лишние Fragment и упорядочены дочерние элементы Menu
    const mobileMenuContent = [
        // Навигационные элементы
        ...filteredNavItems.map((item) => (
            <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                    backgroundColor: isActive(item.path) ? 
                        'rgba(25, 118, 210, 0.1)' : 'transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                }}
            >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                        fontWeight: isActive(item.path) ? 'bold' : 'normal'
                    }}
                />
            </MenuItem>
        )),
        
        // Разделитель
        <Divider key="divider1" sx={{ my: 1 }} />,
        
        // Элементы авторизации
        ...(isLoggedIn ? [
            <MenuItem key="user-info" disabled>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <AccountCircle />
                </ListItemIcon>
                <ListItemText 
                    primary="Пользователь" 
                    secondary={username}
                />
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogoutClick}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Выйти" />
            </MenuItem>
        ] : [
            <MenuItem key="login" component={Link} to="/login">
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Войти" />
            </MenuItem>
        ]),
        
        // Разделитель
        <Divider key="divider2" sx={{ my: 1 }} />,
        
        // Переключатель темы
        <MenuItem 
            key="theme-switcher"
            sx={{ 
                justifyContent: 'space-between',
                '&:hover': {
                    backgroundColor: 'transparent'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {themeMode === 'light' ? <LightIcon /> : <DarkIcon />}
                </ListItemIcon>
                <ListItemText 
                    primary="Тема" 
                    secondary={themeMode === 'dark' ? 'Тёмная' : 'Светлая'}
                />
            </Box>
            <Switch
                size="small"
                checked={themeMode === 'dark'}
                onChange={onToggleTheme}
                color="primary"
            />
        </MenuItem>
    ];

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component={Link}
                    to="/"
                    sx={{ 
                        flexGrow: isMobile ? 1 : 0,
                        mr: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    Трекер технологий
                </Typography>

                {/* Десктопное меню */}
                <Box sx={{ 
                    display: isMobile ? 'none' : 'flex', 
                    flexGrow: 1,
                    gap: 1
                }}>
                    {filteredNavItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                            variant={isActive(item.path) ? "outlined" : "text"}
                            startIcon={item.icon}
                            sx={{
                                border: isActive(item.path) ? 1 : 0,
                                borderColor: 'inherit',
                                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Авторизация для десктопа */}
                    {!isMobile && (
                        isLoggedIn ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                    {username ? username.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                    {username}
                                </Typography>
                                <IconButton 
                                    color="inherit" 
                                    onClick={handleLogoutClick}
                                    size="small"
                                    title="Выйти"
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button 
                                color="inherit" 
                                component={Link}
                                to="/login"
                                startIcon={<LoginIcon />}
                                sx={{ mr: 2 }}
                            >
                                Войти
                            </Button>
                        )
                    )}

                    {/* Переключатель темы */}
                    <IconButton 
                        color="inherit" 
                        onClick={() => onSetTheme(themeMode === 'light' ? 'dark' : 'light')}
                        size="large"
                        title={themeMode === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
                    >
                        {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
                    </IconButton>
                    
                    {!isMobile && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={themeMode === 'dark'}
                                    onChange={onToggleTheme}
                                    color="default"
                                />
                            }
                            label={themeMode === 'dark' ? 'Тёмная' : 'Светлая'}
                            sx={{ 
                                color: 'white', 
                                display: 'flex',
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                    )}

                    {/* Мобильное меню */}
                    {isMobile && (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={handleMobileMenuOpen}
                                size="large"
                                aria-label="открыть меню"
                                aria-controls="mobile-menu"
                                aria-haspopup="true"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="mobile-menu"
                                anchorEl={mobileMenuAnchor}
                                open={Boolean(mobileMenuAnchor)}
                                onClose={handleMobileMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        minWidth: 200,
                                        '& .MuiMenuItem-root': {
                                            fontSize: '0.9rem',
                                            py: 1.5
                                        }
                                    }
                                }}
                                MenuListProps={{
                                    'aria-labelledby': 'mobile-menu',
                                }}
                            >
                                {mobileMenuContent}
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;