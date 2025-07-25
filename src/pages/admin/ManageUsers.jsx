// pages/admin/ManageUsers.jsx
import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button
} from '@mui/material';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', progress: '75%' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', progress: '100%' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Inactive', progress: '25%' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Active', progress: '50%' },
];

const ManageUsers = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User List
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={user.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.progress}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManageUsers;