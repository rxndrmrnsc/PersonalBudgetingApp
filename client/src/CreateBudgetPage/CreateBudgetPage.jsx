import React, { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField, Button, Stack, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import { createBudget } from '../api/api';
import { getPrediction } from '../api/pyApi';

const CreateBudgetPage = (props) => {
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const [mode, setMode] = useState('blank');
  const [title, setTitle] = useState('July Budget');
  const [date, setDate] = useState(dayjs('2025-07-01'));
  const [selectedPreviousId, setSelectedPreviousId] = useState("");


  function transformPredictionToBudget(predictions) {
    const budget = {
      incomes: [],
      expenses: {
        needs: [],
        wants: []
      },
      savings: []
    };

    predictions.forEach(({ category, sub_category, predicted }) => {
      const entry = {
        name: sub_category,
        expected: parseFloat(predicted.toFixed(2)),
        actual: 0
      };

      if (category === "income") {
        budget.incomes.push(entry);
      } else if (category === "expenses: needs") {
        budget.expenses.needs.push(entry);
      } else if (category === "expenses: wants") {
        budget.expenses.wants.push(entry);
      } else if (category === "savings") {
        budget.savings.push(entry);
      }
    });

    console.log('Transformed budget:', budget);
    return budget;
  }

  const handleModeChange = (_, newMode) => {
    if (newMode) setMode(newMode);
  };

  const handleCreate = async () => {
    console.log('Creating new budget:', { mode, title });

    let baseData = {
      title: title,
      month: monthNames[date.month()],
      year: date.year()
    };

    if (mode === 'template') {
      try {
        console.log('Using template budget');
        const res = await getPrediction(localStorage.getItem('userId'));
        const predictions = res.data.predicted_budget || [];
        const transformed = transformPredictionToBudget(predictions);

        baseData = {
          ...baseData,
          incomes: transformed.incomes,
          expenses: transformed.expenses,
          savings: transformed.savings
        };
      } catch (err) {
        console.error('Failed to fetch predicted budget:', err);
        alert("Failed to generate template. Please try again.");
        return;
      }
    } else if (mode === 'previous') {
      console.log('Copying from previous budget with ID:', selectedPreviousId);
      if (!selectedPreviousId) {
        alert("Please select a budget to copy.");
        return;
      }
      const previousBudget = props.budgets.find(b => b.id === selectedPreviousId);
      console.log(previousBudget)
      if (!previousBudget) {
        alert("Selected budget not found.");
        return;
      }
      baseData = {
        ...baseData,
        incomes: previousBudget.incomes,
        expenses: previousBudget.expenses,
        savings: previousBudget.savings
      };

    } else if (mode === 'blank') {
      console.log('Creating blank budget');
      baseData = {
        ...baseData,
        incomes: [{ name: 'Salary', expected: 0, actual: 0 }],
        expenses: {
          needs: [{ name: 'Rent', expected: 0, actual: 0 }],
          wants: [{ name: 'Clothes', expected: 0, actual: 0 }]
        },
        savings: [{ name: 'Emergency Fund', expected: 0, actual: 0 }]
      };
    } else {
      console.error('Unknown mode:', mode);
    }

    // Only create budget after all necessary data is ready
    try {
      console.log("User id: " + localStorage.getItem('userId'));
      const res = await createBudget(localStorage.getItem('userId'), baseData);
      console.log('Budget created:', res.data);
      props.onBack();
    } catch (err) {
      console.error('API error:', err);
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: '100vh',
          color: 'white',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Create new budget
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          color="primary"
          sx={{ backgroundColor: '#1e1e1e', borderRadius: 1 }}
        >
          <ToggleButton value="blank" sx={{ color: 'white' }}>
            Blank
          </ToggleButton>
          <ToggleButton value="template" sx={{ color: 'white' }}>
            Use template
          </ToggleButton>
          <ToggleButton value="previous" sx={{ color: 'white' }}>
            Copy from previous
          </ToggleButton>
        </ToggleButtonGroup>

        <Stack spacing={2} sx={{ maxWidth: 300 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              backgroundColor: '#1e1e1e',
              borderRadius: 1,
            }}
            fullWidth
          />

          <DatePicker
            label="Date"
            views={['year', 'month']}
            value={date}
            onChange={setDate}
            openTo="month"
            slots={{
              openPickerIcon: CalendarMonthIcon,
            }}
            sx={{
              backgroundColor: '#1e1e1e',
              borderRadius: 1,
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiPickersInputBase-root': { color: 'white' },
              '& .MuiSvgIcon-root': { color: 'white' },
            }}
          />
        </Stack>

        {mode === 'previous' && (
          <TextField
            select
            label="Select a previous budget"
            value={selectedPreviousId}
            onChange={(e) => setSelectedPreviousId(e.target.value)}
            InputLabelProps={{ style: { color: 'white' } }}
            sx={{
              backgroundColor: '#1e1e1e',
              borderRadius: 1,
              color: 'white',
              '& .MuiSelect-icon': { color: 'white' },
              '& .MuiInputBase-input': { color: 'white' },
            }}
            fullWidth
          >
            <MenuItem value="">
              -- Select a budget --
            </MenuItem>
            {props.budgets.map((budget) => (
              <MenuItem key={budget.id} value={budget.id}>
                {budget.title} ({budget.month} {budget.year})
              </MenuItem>
            ))}
          </TextField>
        )}


        <Box mt={4}>
          <Button
            variant="contained"
            size="large"
            startIcon={<span>+</span>}
            onClick={handleCreate}
            sx={{
              backgroundColor: '#7b5cd6',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 4,
              '&:hover': {
                backgroundColor: '#5e44a1',
              },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateBudgetPage;
