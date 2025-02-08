import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MonthlyBudget from './MonthlyBudget/MonthlyBudget'

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <MonthlyBudget />
      </Box>
    </Container>
  );
}