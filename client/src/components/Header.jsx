import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Task as TaskIcon, 
  Person as ProfileIcon, 
  Logout as LogoutIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: 40,
    marginRight: 16, // Direct pixel value instead of theme.spacing
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  drawer: {
    width: 250,
  },
  appBar: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  }
});

function Header() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = isAuthenticated ? [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Tasks', icon: <TaskIcon />, link: '/tasks' },
    { text: 'Profile', icon: <ProfileIcon />, link: '/profile' },
    { 
      text: 'Logout', 
      icon: <LogoutIcon />, 
      onClick: () => {
        logout();
        window.location.href = '/';
      }
    }
  ] : [
    { text: 'Login', icon: <LoginIcon />, link: '/' },
    { text: 'Register', icon: <RegisterIcon />, link: '/register' }
  ];

  const renderDrawer = () => (
    <List>
      {menuItems.map((item, index) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ListItem 
            button 
            component={item.link ? Link : 'div'} 
            to={item.link}
            onClick={item.onClick || handleDrawerToggle}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </motion.div>
      ))}
    </List>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={4}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title}>
            <Link to="/dashboard" className={classes.link}>
              <img 
                src="https://psiborg.in/wp-content/uploads/2024/03/psiborg-logo-white-circle.webp" 
                alt="PsiBorg Logo" 
                className={classes.logo} 
              />
              PsiBorg Task
            </Link>
          </Typography>
          
          {!isMobile && menuItems.map((item) => (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                color="inherit" 
                component={item.link ? Link : 'div'}
                to={item.link}
                onClick={item.onClick}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            </motion.div>
          ))}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{ paper: classes.drawer }}
          ModalProps={{ keepMounted: true }}
        >
          {renderDrawer()}
        </Drawer>
      )}
    </div>
  );
}

export default Header;