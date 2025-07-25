// pages/admin/AdminRoutes.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar, { drawerWidth } from './Sidebar';
import AdminDashboard from './AdminDashboard';
import ManageUsers from './ManageUsers';
import ManageContent from './ManageContent';
import Analytics from './Analytics';
import Settings from './Settings';

const AdminRoutes = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle} 
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/content" element={<ManageContent />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminRoutes;