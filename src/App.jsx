//avoid designing, establishing or implementing any features inside the App.jsx file, it should remain as a simple routing/rendering file
// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/landing/LandingPage';
import AdminRoutes from './pages/admin/AdminRoutes';
import UserRoutes from './pages/user/UserRoutes';
import Sample from './pages/other/Sample';
import NotFound from './pages/other/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          {/* User routes */}
          <Route path="/user/*" element={<UserRoutes />} />
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          {/* Route all components that are neither admin or user here as needed */}
          <Route path="/sample" element={<Sample />} />
          {/* Fallback route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;