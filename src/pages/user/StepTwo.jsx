// pages/user/StepTwo.jsx
import React from 'react';
import { Typography, Box, Card, CardContent, Chip } from '@mui/material';

const StepTwo = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Step Two: Components & JSX
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What you'll learn:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="JSX Syntax" color="primary" />
            <Chip label="Functional Components" color="primary" />
            <Chip label="Component Structure" color="primary" />
            <Chip label="Props Basics" color="primary" />
          </Box>
          
          <Typography variant="body1" paragraph>
            Components are the building blocks of React applications. JSX allows you to write HTML-like syntax in JavaScript.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Example Component:
          </Typography>
          
          <Box component="pre" sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1, 
            overflow: 'auto',
            fontFamily: 'monospace'
          }}>
            {`function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="React Developer" />`}
          </Box>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            This component accepts a 'name' prop and renders a greeting. JSX expressions are enclosed in curly braces.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepTwo;