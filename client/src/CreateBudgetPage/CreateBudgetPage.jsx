import React, { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField, Button, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import { createBudget } from '../api/api';

const CreateBudgetPage = ( props ) => {
  const USER_ID = "683c5b8e5179c85ea2c2c176";
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const [mode, setMode] = useState('blank');
  const [title, setTitle] = useState('July Budget');
  const [date, setDate] = useState(dayjs('2025-07-01'));

  const handleModeChange = (_, newMode) => {
    if (newMode) setMode(newMode);
  };

  const handleCreate = () => {
    console.log('Creating new budget:', { mode, title, date });
  
    // Submit logic here 
    createBudget(USER_ID, { title: title, month: monthNames[date.month()], year: date.year() })
          .then(res => {
            console.log('Budget created:', res.data);
            props.onBack(); // Call the onBack prop to return to the dashboard
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
