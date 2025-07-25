"use client";

import { Box } from "@mui/material";
import Navbar from './Navbar';
import SignTokenDashboard from './SignTokenDashboard';
import Footer from './footer';

const LandingPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        maxWidth: "1600px", // Match SignTokenDashboard and Footer
        mx: "auto", // Center content
        bgcolor: 'inherit', // Ensure background consistency
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 7, sm: 8, md: 9 }, // Adjusted for Navbar height
          overflowY: "auto", // Enable vertical scrolling
          overflowX: "hidden", // Prevent horizontal overflow
        }}
      >
        <SignTokenDashboard />
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;