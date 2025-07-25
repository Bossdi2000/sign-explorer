// pages/user/UserDashboard.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const steps = [
  { title: 'Step One', description: 'Create React App', progress: 100, color: 'success' },
  { title: 'Step Two', description: 'Components & JSX', progress: 75, color: 'primary' },
  { title: 'Step Three', description: 'State & Props', progress: 50, color: 'warning' },
  { title: 'Step Four', description: 'Hooks & Effects', progress: 25, color: 'error' },
];

const UserDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to React Learning Dashboard
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Track your progress through our React tutorial series. Click on any step in the sidebar to continue learning.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{step.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={step.progress}
                    color={step.color}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserDashboard;