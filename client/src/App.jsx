import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import MonthlyBudget from './MonthlyBudget/MonthlyBudget'
import Dashboard from './Dashboard/Dashboad'
import CreateBudgetPage from './CreateBudgetPage/CreateBudgetPage'
import PredictedBudgetReport from './PredictedBudgetReport';
import Chatbot from './Chatbot';
import AuthForm from './AuthForm';
import { getBudgets, getBudgetById } from './api/api';
import { loginWithForm, registerUser } from './api/authApi';

export default function App() {
//  localStorage.removeItem('username');
//  localStorage.removeItem('password');
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

useEffect(() => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const userId = localStorage.getItem('userId');
  if (username && password && userId) {
    getBudgets()
      .then(res => {
        setBudgets(res.data);
      })
      .catch(err => {
        console.error('API error:', err);
        setError('Failed to load budgets.');
      });
  }
}, [loggedIn]);



  const handleSelectBudget = (id) => {
    setActiveBudgetId(id);

    getBudgetById(id)
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

    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
      getBudgets()
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

  const handleAuth = async ({ username, password, mode }) => {
    console.log(`${mode.toUpperCase()}:`, username, password);
    if (mode.toUpperCase() === 'REGISTER') {
      registerUser(username, password)
        .then(res => {
          console.log('User registered successfully:', res);
        })
        .catch(err => {
          console.error('Failed to register user:', err);
          setError('Failed to register user: ' + err.message);
        });
    }
    else if (mode.toUpperCase() === 'LOGIN') {
      await loginWithForm(username, password)
        .then(res => {
          console.log('User logged in successfully', res);
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          localStorage.setItem('userId', res.data.userId);
          setLoggedIn(true);
        })
        .catch(err => {
          console.error('Failed to log in user:', err);
          setError('Failed to log in user: ' + err.message);
        })
    }
  };


  if (error) return <p>{error}</p>;

  if (!localStorage.getItem('username') && !localStorage.getItem('password')) return <AuthForm onSubmit={handleAuth} />


  return (
    <Container maxWidth={false} sx={{ width: '100%', minWidth: '300px', height: '100vh' }}>
      <>
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
              px: 2, // Optional padding for small screens
            }}
          >
            <Box sx={{ width: '100%', maxWidth: '700px' }}>
              <Chatbot onBack={handleBackToDashboard} />

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
      </>
    </Container>
  );
}