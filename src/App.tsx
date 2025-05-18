import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Accounts from './pages/Accounts';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Requests from './pages/Requests';
import { DepartmentProvider } from './context/DepartmentContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DepartmentProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/" element={<Accounts />} />
          </Routes>
        </Router>
      </DepartmentProvider>
    </ThemeProvider>
  );
}

export default App; 