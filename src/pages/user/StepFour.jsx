// pages/user/StepFour.jsx
import React from 'react';
import { Typography, Box, Card, CardContent, Chip } from '@mui/material';

const StepFour = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Step Four: Hooks & Effects
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What you'll learn:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="useEffect Hook" color="primary" />
            <Chip label="Side Effects" color="primary" />
            <Chip label="Component Lifecycle" color="primary" />
            <Chip label="API Calls" color="primary" />
          </Box>
          
          <Typography variant="body1" paragraph>
            The useEffect hook lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            useEffect Example:
          </Typography>
          
          <Box component="pre" sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1, 
            overflow: 'auto',
            fontFamily: 'monospace'
          }}>
            {`import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts or userId changes
    fetchUser(userId).then(setUser);
  }, [userId]);

  return (
    <div>
      {user ? <h1>{user.name}</h1> : <p>Loading...</p>}
    </div>
  );
}`}
          </Box>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            The useEffect hook runs after the component renders. The dependency array [userId] ensures it only runs when userId changes.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepFour;