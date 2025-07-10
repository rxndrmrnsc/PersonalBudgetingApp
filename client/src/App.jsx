import React, { useState, useEffect } from 'react';
import { Container, Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material'; // Added AppBar, Toolbar, Typography, IconButton, Button
import LogoutIcon from '@mui/icons-material/Logout'; // Import LogoutIcon

import MonthlyBudget from './MonthlyBudget/MonthlyBudget'
import Dashboard from './Dashboard/Dashboad'
import CreateBudgetPage from './CreateBudgetPage/CreateBudgetPage'
import PredictedBudgetReport from './PredictedBudgetReport';
import Chatbot from './Chatbot'; // This should be the file where the above Chatbot component is defined
import AuthForm from './AuthForm';
import { getBudgets, getBudgetById, apiClient } from './api/api';
import { loginWithForm, registerUser, logoutUser } from './api/authApi';

export default function App() {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [activeBudgetId, setActiveBudgetId] = useState(null);
  const [activeBudget, setActiveBudget] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [isShowingReport, setIsShowingReport] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!(localStorage.getItem('username') && localStorage.getItem('password'));
  });
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // Add username state
  const [password, setPassword] = useState(localStorage.getItem('password') || ''); // Add password state
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || ''); // New state for userId

  // Effect to load budgets when loggedIn state changes
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedUserId = localStorage.getItem('userId');

    if (storedUsername && storedPassword && storedUserId) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setCurrentUserId(storedUserId); // Set userId state

      // Re-initialize apiClient with current credentials
      const token = btoa(`${storedUsername}:${storedPassword}`);
      apiClient.defaults.headers.common['Authorization'] = `Basic ${token}`;

      console.log('Attempting to fetch budgets for userId:', storedUserId);
      getBudgets(storedUserId)
        .then(res => {
          setBudgets(res.data);
        })
        .catch(err => {
          console.error('API error:', err);
          setError('Failed to load budgets.');
          // If authentication fails here, might need to force logout
          // if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          //   console.log('Authentication failed during budget fetch, logging out.');
          //   handleLogout(); // Automatically log out if credentials are bad
          // }
        });
    } else {
      // If not logged in, clear budgets
      setBudgets([]);
      setCurrentUserId(''); // Ensure userId state is cleared
      // Also clear Authorization header if not logged in
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [loggedIn]);

  const handleSelectBudget = (id) => {
    setActiveBudgetId(id);

    getBudgetById(currentUserId, id) // Pass the userId here
      .then(res => {
        setActiveBudget(res.data);
        console.log('Selected budget:', res.data);
      })
      .catch(err => {
        console.error('API error:', err);
        setError('Failed to load budget details.');
      });

    setIsCreating(false);
  };

  const handleCreateNewBudget = () => {
    setIsCreating(true);
    setActiveBudgetId(null);
    setActiveBudget({});
  };

  const handleCreateReport = () => {
    console.log('Creating report...');
    setIsShowingReport(true);
    setIsCreating(false);
    setActiveBudgetId(null);
    setActiveBudget({});
  };

  const handleBackToDashboard = () => {
    setIsCreating(false);
    setActiveBudgetId(null);
    setActiveBudget({});
    setIsShowingReport(false);
    setIsChatting(false);

    // Reload budgets after returning to dashboard if logged in
    if (loggedIn && currentUserId) { // Ensure currentUserId is available
      getBudgets(currentUserId) // Pass the userId here
        .then(res => {
          setBudgets(res.data);
        })
        .catch(err => {
          console.error('API error:', err);
          setError('Failed to reload budgets.');
        });
    }
  };

  const handleChatWithBot = () => {
    setIsCreating(false);
    setIsShowingReport(false);
    setActiveBudgetId(null);
    setActiveBudget({});
    setIsChatting(true);
  };

  const handleAuth = async ({ username: authUsername, password: authPassword, mode }) => {
    setError(null); // Clear previous errors
    console.log(`${mode.toUpperCase()}:`, authUsername, authPassword);

    try {
      if (mode.toUpperCase() === 'REGISTER') {
        const res = await registerUser(authUsername, authPassword);
        console.log('User registered successfully:', res);
        alert('Registration successful! You can now log in.'); // Use proper UI feedback
      } else if (mode.toUpperCase() === 'LOGIN') {
        const res = await loginWithForm(authUsername, authPassword);
        console.log('User logged in successfully', res);
        localStorage.setItem('username', authUsername);
        localStorage.setItem('password', authPassword);
        localStorage.setItem('userId', res.data.userId);

        setUsername(authUsername); // Update state
        setPassword(authPassword); // Update state
        setCurrentUserId(res.data.userId); // Update userId state
        setLoggedIn(true); // Set loggedIn to true

        // Update the default headers for apiClient immediately after login
        const token = btoa(`${authUsername}:${authPassword}`);
        apiClient.defaults.headers.common['Authorization'] = `Basic ${token}`;

        //alert('Login successful!'); // Use proper UI feedback
      }
    } catch (err) {
      console.error(`Failed to ${mode} user:`, err);
      setError(`Failed to ${mode} user: ` + (err.response?.data?.message || err.message));
      alert(`Failed to ${mode} user: ` + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = async () => {
    setError(null); // Clear any existing errors
    try {
      await logoutUser(); // Assuming logoutUser is defined in authApi.js and calls the backend /logout

      // Clear client-side storage
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('userId');

      // Reset states
      setUsername('');
      setPassword('');
      setCurrentUserId(''); // Clear userId state
      setBudgets([]);
      setActiveBudgetId(null);
      setActiveBudget({});
      setIsCreating(false);
      setIsShowingReport(false);
      setIsChatting(false);
      setLoggedIn(false);

      // Clear the Authorization header from apiClient
      delete apiClient.defaults.headers.common['Authorization'];

      alert('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
      setError('Logout failed: ' + (error.response?.data?.message || error.message));
      alert('Logout failed: ' + (error.response?.data?.message || error.message));
      // Even if server-side logout fails, clear client-side for security
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('userId');
      setUsername('');
      setPassword('');
      setCurrentUserId('');
      setBudgets([]);
      setActiveBudgetId(null);
      setActiveBudget({});
      setIsCreating(false);
      setIsShowingReport(false);
      setIsChatting(false);
      setLoggedIn(false);
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };


  // Conditional rendering based on loggedIn state
  if (!loggedIn) {
    return <AuthForm onSubmit={handleAuth} />;
  }

  // If logged in, render the main application content
  return (
    <Container maxWidth={false} sx={{ width: '100%', minWidth: '300px', height: '100vh' }}>
      {/* Main App Bar for the entire application */}
      <AppBar position="static" sx={{ bgcolor: '#4f378b', borderRadius: '4px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            Budgeting App (User: {username})
          </Typography>
          {/* Logout button in the main App Bar */}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 2 }}> {/* Add padding top below AppBar */}
        {error ? (
          <p>{error}</p>
        ) : isChatting ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '80vh',
              px: 2,
            }}
          >
            <Box sx={{ width: '100%', maxWidth: '700px' }}>
              {/* Pass onBack and onLogout to Chatbot */}
              <Chatbot onBack={handleBackToDashboard} onLogout={handleLogout} username={username} />
            </Box>
          </Box>
        ) : isShowingReport ? (
          <PredictedBudgetReport userId={localStorage.getItem('userId')} onBack={handleBackToDashboard} />
        ) : isCreating ? (
          <CreateBudgetPage budgets={budgets} onBack={handleBackToDashboard} />
        ) : activeBudgetId && activeBudget && activeBudget.id === activeBudgetId ? (
          <MonthlyBudget budgetId={activeBudgetId} budget={activeBudget} setActiveBudgetId={setActiveBudgetId} onBack={handleBackToDashboard} />
        ) : (
          <Dashboard budgets={budgets} onSelectBudget={handleSelectBudget} onCreateNewBudget={handleCreateNewBudget} onCreateReport={handleCreateReport} onChatWithBot={handleChatWithBot} />
        )
        }
      </Box>
    </Container>
  );
}
