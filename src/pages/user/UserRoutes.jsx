// pages/user/UserRoutes.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar, { drawerWidth } from './Sidebar';
import UserDashboard from './UserDashboard';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';

const UserRoutes = () => {
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
          <Route path="/" element={<UserDashboard />} />
          <Route path="/step-one" element={<StepOne />} />
          <Route path="/step-two" element={<StepTwo />} />
          <Route path="/step-three" element={<StepThree />} />
          <Route path="/step-four" element={<StepFour />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default UserRoutes;