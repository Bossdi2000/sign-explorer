// pages/admin/AdminDashboard.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const stats = [
  { title: 'Total Users', value: '1,234', color: 'primary.main' },
  { title: 'Active Sessions', value: '456', color: 'success.main' },
  { title: 'Completed Tutorials', value: '789', color: 'warning.main' },
  { title: 'Monthly Revenue', value: '$2,345', color: 'error.main' },
];

const AdminDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Welcome to the admin panel. Here you can manage users, content, and view analytics.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;