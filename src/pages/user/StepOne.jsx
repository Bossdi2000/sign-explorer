//pages/user/StepOne.jsx
import React from 'react';
import { Typography, Box, Card, CardContent, Chip } from '@mui/material';

const StepOne = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Step One: Create React App
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What you'll learn:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="Project Setup" color="primary" />
            <Chip label="NPX Commands" color="primary" />
            <Chip label="File Structure" color="primary" />
            <Chip label="Development Server" color="primary" />
          </Box>
          
          <Typography variant="body1" paragraph>
            Create React App is a comfortable environment for learning React, and is the best way to start building a new single-page application in React.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Getting Started:
          </Typography>
          
          <Box component="pre" sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1, 
            overflow: 'auto',
            fontFamily: 'monospace'
          }}>
            {`npx create-react-app my-app
cd my-app
npm start`}
          </Box>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            This will create a new React application with all the necessary dependencies and configuration files. 
            The development server will start automatically and open your browser to http://localhost:3000.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepOne;