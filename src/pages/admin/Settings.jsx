// pages/admin/Settings.jsx
import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel,
  Grid 
} from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Site Title"
                  defaultValue="React Tutorial App"
                  fullWidth
                />
                <TextField
                  label="Admin Email"
                  defaultValue="admin@example.com"
                  fullWidth
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow User Registration"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email Notifications"
                />
                <Button variant="contained" color="primary">
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Change Password"
                  type="password"
                  fullWidth
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Two-Factor Authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Login Notifications"
                />
                <Button variant="contained" color="secondary">
                  Update Security
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;