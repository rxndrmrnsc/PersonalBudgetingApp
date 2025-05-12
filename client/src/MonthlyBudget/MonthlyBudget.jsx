import * as React from 'react';
import Container from '@mui/material/Container';
import { Button, IconButton, Grid2, Typography, Box } from '@mui/material';
import CustomTable from '../Table/CustomTable'
import StarIcon from '@mui/icons-material/Star';

export default function MonthlyBudget(props) {
    const title = props.budgetId + " budget";
    const mockRows = [
        {
            id: 0,
            name: "Job",
            expected: 3000,
            actual: 3500
        },
        {
            id: 1,
            name: "Bonuri de masa",
            expected: 300,
            actual: 200
        }
    ]

    const handleRetrun = () => {
        props.setActiveBudgetId(null);
    }

    return (
        <Box maxWidth sx={{ padding: 2, width: '100%', minWidth: '300px', minHeight: '100vh' }}>

            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
                {title}
            </Typography>
            <Grid2 container rowSpacing={6} columnSpacing={4} columns={12}>
                {/* Row 1: Income & Pie Chart placeholder */}
                <Grid2 item size={6}>
                    <CustomTable title="Income" rows={mockRows} />
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
                    <CustomTable title="Needs" rows={mockRows} />
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title="Wants" rows={mockRows} />
                </Grid2>

                {/* Row 3: Savings */}
                <Grid2 item size={6}>
                    <CustomTable title="Savings" rows={mockRows} />
                </Grid2>
                <Grid2 item size={6}>
                </Grid2>


                {/* Row 4: Buttons */}
                <Grid2 item size={12}>
                    <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        sx={{
                            backgroundColor: "#4f378b",
                            color: "white",
                            "&:hover": { backgroundColor: "#3d2a6d" }, // Darker shade on hover
                            textTransform: "none", // Keep text case as is
                            fontWeight: "bold",
                        }}
                        onClick={handleRetrun}
                    >
                        Save and return
                    </Button>

                </Grid2>
            </Grid2>
        </Box>
    );
}