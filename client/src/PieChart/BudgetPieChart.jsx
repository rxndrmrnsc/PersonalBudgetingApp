import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { teal, amber, orange, indigo } from '@mui/material/colors';

const COLORS = [teal[600], amber[600], orange[600], indigo[600]];

const BudgetPieChart = ({ incomes, needs, wants, savings }) => {
  const data = [
    { name: 'Incomes', value: incomes },
    { name: 'Needs', value: needs },
    { name: 'Wants', value: wants },
    { name: 'Savings', value: savings },
  ];

  return (
    <Paper sx={{ padding: 2, backgroundColor: '#1e1e1e', color: 'white' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
        Budget Breakdown
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BudgetPieChart;
