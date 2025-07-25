// pages/other/NotFound.jsx
import React from 'react';
import { Container, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', p: 6 }}>
          <Typography variant="h1" component="div" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Sorry, the page you are looking for doesn't exist or has been moved.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Go Home
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NotFound;