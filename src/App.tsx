import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Component to handle page retention
const PageRetention = () => {
  const location = useLocation();
  const path = location.pathname;

  // Map of valid routes to their components
  const routeMap: { [key: string]: React.ReactNode } = {
    '/accounts': <Accounts />,
    '/departments': <Departments />,
    '/employees': <Employees />,
    '/requests': <Requests />,
    '/': <Accounts />
  };

  // If the current path is valid, render its component
  if (routeMap[path]) {
    return <>{routeMap[path]}</>;
  }

  // If path is not valid, redirect to home
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DepartmentProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/*" element={<PageRetention />} />
          </Routes>
        </Router>
      </DepartmentProvider>
    </ThemeProvider>
  );
}

export default App; 