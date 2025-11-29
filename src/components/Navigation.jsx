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
    Divider
} from '@mui/material';
import {
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
    Menu as MenuIcon,
    Home as HomeIcon,
    Add as AddIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import './Navigation.css';

function Navigation({ themeMode, onToggleTheme, onSetTheme }) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const navItems = [
        { path: '/', label: 'Главная', icon: <HomeIcon /> },
        { path: '/add-technology', label: 'Добавить технологию', icon: <AddIcon /> },
        { path: '/statistics', label: 'Статистика', icon: <AnalyticsIcon /> },
        { path: '/settings', label: 'Настройки', icon: <SettingsIcon /> }
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

    const isActive = (path) => {
        return location.pathname === path;
    };

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
                    TechTracker
                </Typography>

                {/* Десктопное меню */}
                <Box sx={{ 
                    display: isMobile ? 'none' : 'flex', 
                    flexGrow: 1,
                    gap: 1
                }}>
                    {navItems.map((item) => (
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
                    {/* Переключатель темы */}
                    <IconButton 
                        color="inherit" 
                        onClick={() => onSetTheme(themeMode === 'light' ? 'dark' : 'light')}
                        size="large"
                        title={themeMode === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
                    >
                        {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
                    </IconButton>
                    
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
                            display: isMobile ? 'none' : 'flex',
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.875rem'
                            }
                        }}
                    />

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
                                {navItems.map((item) => (
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
                                ))}
                                
                                <Divider sx={{ my: 1 }} />
                                
                                <MenuItem 
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
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;