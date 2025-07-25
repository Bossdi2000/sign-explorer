// pages/user/Sidebar.jsx
import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/user', component: 'dashboard' },
    { label: 'Step One', path: '/user/step-one', component: 'step-one' },
    { label: 'Step Two', path: '/user/step-two', component: 'step-two' },
    { label: 'Step Three', path: '/user/step-three', component: 'step-three' },
    { label: 'Step Four', path: '/user/step-four', component: 'step-four' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          User Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Header/AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            React Learning Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export { drawerWidth };
export default Sidebar;