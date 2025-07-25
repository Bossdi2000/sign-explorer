// pages/admin/Analytics.jsx
import React from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Engagement
              </Typography>
              <Typography variant="body1">
                Average session duration: 12 minutes
              </Typography>
              <Typography variant="body1">
                Pages per session: 3.2
              </Typography>
              <Typography variant="body1">
                Bounce rate: 25%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tutorial Completion
              </Typography>
              <Typography variant="body1">
                Step One: 95% completion rate
              </Typography>
              <Typography variant="body1">
                Step Two: 80% completion rate
              </Typography>
              <Typography variant="body1">
                Step Three: 65% completion rate
              </Typography>
              <Typography variant="body1">
                Step Four: 45% completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;