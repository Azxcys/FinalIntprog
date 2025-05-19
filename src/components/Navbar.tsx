import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IPT Final (Group F) - Magsayo
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/accounts">
            Accounts
          </Button>
          <Button color="inherit" component={RouterLink} to="/employees">
            Employees
          </Button>
          <Button color="inherit" component={RouterLink} to="/departments">
            Departments
          </Button>
          <Button color="inherit" component={RouterLink} to="/requests">
            Requests
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 