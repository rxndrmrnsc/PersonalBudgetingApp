import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import MonthlyBudget from './MonthlyBudget/MonthlyBudget'
import Dashboard from './Dashboard/Dashboad'
import CreateBudgetPage from './CreateBudgetPage/CreateBudgetPage'
import { getBudgets, getBudgetById } from './api/api';

export default function App() {
  const USER_ID = "683c5b8e5179c85ea2c2c176";
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [activeBudgetId, setActiveBudgetId] = useState(null);
  const [activeBudget, setActiveBudget] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    getBudgets(USER_ID)
      .then(res => {
        setBudgets(res.data)
      })
      .catch(err => {
        console.error('API error:', err);
        setError('Failed to load budgets.');3
      });
  }, []);


  const handleSelectBudget = (id) => {
    setActiveBudgetId(id);

    getBudgetById(USER_ID, id)
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

  const handleBackToDashboard = () => {
    setIsCreating(false);
    setActiveBudgetId(null);
    setActiveBudget({});
  };

  if (error) return <p>{error}</p>;

  return (
    <Container maxWidth={false} sx={{ width: '100%', minWidth: '300px' }}>
      <>
        {
          isCreating ? (
            <CreateBudgetPage onBack={handleBackToDashboard} />
          ) : (

            activeBudgetId && activeBudget && activeBudget.id === activeBudgetId ? (
              <MonthlyBudget budgetId={activeBudgetId} budget={activeBudget} setActiveBudgetId={setActiveBudgetId} onBack={handleBackToDashboard} />
            ) : (
              <Dashboard budgets={budgets} onSelectBudget={handleSelectBudget} onCreateNewBudget={handleCreateNewBudget} />
            )
          )
        }
      </>
    </Container>
  );
}