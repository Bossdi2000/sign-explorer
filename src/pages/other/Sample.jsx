// pages/other/Sample.jsx
import React from 'react';
import { Container, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sample = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Sample Page
          </Typography>
          <Typography variant="body1" paragraph>
            This is a sample page that demonstrates how other components can be routed independently 
            from the main admin and user sections.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back to Home
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => navigate('/user')}
            >
              Go to User Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Sample;