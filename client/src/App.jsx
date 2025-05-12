import { React, useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MonthlyBudget from './MonthlyBudget/MonthlyBudget'
import Dashboard from './Dashboard/Dashboad'

export default function App() {
  const mockBudgets = [
    { id: 1, title: "January Budget", month: "January", year: 2025 },
    { id: 2, title: "January Budget", month: "February", year: 2025 },
    { id: 3, title: "January Budget", month: "March", year: 2025 }
  ];

  const [activeBudgetId, setActiveBudgetId] = useState(null);

  const handleSelectBudget = (id) => {
    setActiveBudgetId(id);
  };

  return (
    <Container maxWidth={false} sx={{ width: '100%', minWidth: '300px' }}>
      <>
        {activeBudgetId ? (
          <MonthlyBudget budgetId={activeBudgetId} setActiveBudgetId={setActiveBudgetId} />
        ) : (
          <Dashboard budgets={mockBudgets} onSelectBudget={handleSelectBudget} />
        )}
      </>
    </Container>
  );
}