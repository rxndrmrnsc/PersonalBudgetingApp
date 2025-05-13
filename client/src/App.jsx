import React, { useState } from 'react';
import { Container } from '@mui/material';
import MonthlyBudget from './MonthlyBudget/MonthlyBudget'
import Dashboard from './Dashboard/Dashboad'
import CreateBudgetPage from './CreateBudgetPage/CreateBudgetPage'

export default function App() {
  const mockBudgets = [
    { id: 1, title: "January Budget", month: "January", year: 2025 },
    { id: 2, title: "January Budget", month: "February", year: 2025 },
    { id: 3, title: "January Budget", month: "March", year: 2025 }
  ];

  const [activeBudgetId, setActiveBudgetId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectBudget = (id) => {
    setActiveBudgetId(id);
    setIsCreating(false);
  };

  const handleCreateNewBudget = () => {
    setIsCreating(true);
    setActiveBudgetId(null);
  };

  const handleBackToDashboard = () => {
    setIsCreating(false);
    setActiveBudgetId(null);
  };

  return (
    <Container maxWidth={false} sx={{ width: '100%', minWidth: '300px' }}>
      <>
        {
          isCreating ? (
            <CreateBudgetPage onBack={handleBackToDashboard} />
          ) : (

            activeBudgetId ? (
              <MonthlyBudget budgetId={activeBudgetId} setActiveBudgetId={setActiveBudgetId} onBack={handleBackToDashboard} />
            ) : (
              <Dashboard budgets={mockBudgets} onSelectBudget={handleSelectBudget} onCreateNewBudget={handleCreateNewBudget} />
            )
          )
        }
      </>
    </Container>
  );
}