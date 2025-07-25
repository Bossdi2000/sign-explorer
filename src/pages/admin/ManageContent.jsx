// pages/admin/ManageContent.jsx
import React from 'react';
import { Typography, Box, Card, CardContent, Grid, Button, Chip } from '@mui/material';

const content = [
  { title: 'Step One Tutorial', status: 'Published', lastUpdated: '2024-01-15' },
  { title: 'Step Two Tutorial', status: 'Published', lastUpdated: '2024-01-20' },
  { title: 'Step Three Tutorial', status: 'Draft', lastUpdated: '2024-01-25' },
  { title: 'Step Four Tutorial', status: 'Draft', lastUpdated: '2024-01-30' },
];

const ManageContent = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Content
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="primary">
          Add New Tutorial
        </Button>
      </Box>

      <Grid container spacing={3}>
        {content.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={item.status} 
                    color={item.status === 'Published' ? 'success' : 'warning'}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Updated: {item.lastUpdated}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error">
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageContent;