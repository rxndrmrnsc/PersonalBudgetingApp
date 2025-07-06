import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid2 } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Dashboard = ({ budgets, onSelectBudget, setIsCreating, onCreateNewBudget, onCreateReport, onChatWithBot }) => {
  return (
    <Box sx={{ padding: 4, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
        Your Monthly Budgets
      </Typography>

      <Grid2 container spacing={3}>
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AddIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Plan for next month?
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#4f378b', '&:hover': { backgroundColor: '#3d2a6d' } }}
              onClick={onCreateNewBudget}
            >
              Create New Budget
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Need some extra insight?
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#4f378b', '&:hover': { backgroundColor: '#3d2a6d' } }}
              onClick={onCreateReport}
            >
              Create Report
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToyIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Chat with BudgetBot
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#4f378b', '&:hover': { backgroundColor: '#3d2a6d' } }}
              onClick={onChatWithBot}
            >
              Chat
            </Button>
          </CardContent>
        </Card>
        {budgets.map((budget) => (
          <Grid2 item xs={12} sm={6} md={4} key={budget.id}>
            <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarMonthIcon sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {budget.title}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                      {budget.month} {budget.year}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#4f378b', '&:hover': { backgroundColor: '#3d2a6d' } }}
                  onClick={() => onSelectBudget(budget.id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Dashboard;
