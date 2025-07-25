import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import SignTokenDashboard from './SignTokenDashboard';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1, // Stretch to fill remaining space
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 7, sm: 8 }, // Adjust for fixed Navbar height
        }}
      >
        <SignTokenDashboard />
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;