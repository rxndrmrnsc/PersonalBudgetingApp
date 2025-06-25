import React, { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField, Button, Stack, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import { createBudget } from '../api/api';

const CreateBudgetPage = (props) => {
  const USER_ID = "683c5b8e5179c85ea2c2c176";
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const [mode, setMode] = useState('blank');
  const [title, setTitle] = useState('July Budget');
  const [date, setDate] = useState(dayjs('2025-07-01'));
  const [selectedPreviousId, setSelectedPreviousId] = useState("");

  const handleModeChange = (_, newMode) => {
    if (newMode) setMode(newMode);
  };

  const handleCreate = () => {
    console.log('Creating new budget:', { mode, title, date });

    var baseData = {
      title: title,
      month: monthNames[date.month()],
      year: date.year()
    };

    if (mode === 'blank') {
      // Logic for blank budget
      console.log('Creating blank budget with title:', title);
      baseData = {
        ...baseData,
        incomes: [
          { name: 'Salary', expected: 0, actual: 0 }
        ],
        expenses: {
          needs: [
            { name: 'Rent', expected: 0, actual: 0 }
          ],
          wants: [
            { name: 'Clothes', expected: 0, actual: 0 }
          ],
        },
        savings: [
          { name: 'Emergency Fund', expected: 0, actual: 0 }
        ]
      };
    }

    if (mode === 'previous' && !selectedPreviousId) {
      alert("Please select a budget to copy.");
      return;
    }

    if (mode === 'previous') {
      // Logic to copy from previous budget
      console.log('Copying from previous budget ID:', selectedPreviousId);
      const previousBudget = props.budgets.find(b => b.id === selectedPreviousId);
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
    }


    createBudget(USER_ID, baseData)
      .then(res => {
        console.log('Budget created:', res.data);
        props.onBack();
      })
      .catch(err => {
        console.error('API error:', err);
      });
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
