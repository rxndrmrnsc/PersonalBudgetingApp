import * as React from 'react';
import Container from '@mui/material/Container';
import { Grid2, Typography, Box } from '@mui/material';
import CustomTable from '../Table/CustomTable'

export default function MonthlyBudget() {
    const title = "January Budget";

    return (
        <Box maxWidth sx={{ padding: 2, width: '100%', minWidth: '300px', minHeight: '100vh' }}>

            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
                {title}
            </Typography>
            <Grid2 container rowSpacing={6} columnSpacing={4} columns={12}>
                {/* Row 1: Income & Pie Chart placeholder */}
                <Grid2 item size={6}>
                    <CustomTable title="Income" />
                </Grid2>
                <Grid2 item size={6}>
                    {/* Placeholder for pie chart */}
                    <Box sx={{ border: '2px solid white', borderRadius: '50%', width: '200px', height: '200px', margin: 'auto' }} />
                </Grid2>

                {/* Row 2: Expenses (Needs + Wants) */}
    
                <Grid2 item size={12}>
                <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                    Expenses
                </Typography>
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title="Needs" />
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title="Wants" />
                </Grid2>

                {/* Row 3: Savings */}
                <Grid2 item size={6}>
                    <CustomTable title="Savings" />
                </Grid2>
            </Grid2>
        </Box>
    );
}