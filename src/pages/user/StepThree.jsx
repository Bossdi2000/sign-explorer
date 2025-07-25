// pages/user/StepThree.jsx
import React from 'react';
import { Typography, Box, Card, CardContent, Chip } from '@mui/material';

const StepThree = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Step Three: State & Props
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What you'll learn:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="useState Hook" color="primary" />
            <Chip label="State Management" color="primary" />
            <Chip label="Props Passing" color="primary" />
            <Chip label="Event Handling" color="primary" />
          </Box>
          
          <Typography variant="body1" paragraph>
            State allows components to store and manage their own data. Props enable data flow between components.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            useState Example:
          </Typography>
          
          <Box component="pre" sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1, 
            overflow: 'auto',
            fontFamily: 'monospace'
          }}>
            {`import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
          </Box>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            The useState hook returns a state variable and a function to update it. When state changes, the component re-renders.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepThree;