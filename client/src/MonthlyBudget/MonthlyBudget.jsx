import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CustomTable from '../Table/CustomTable'

export default function MonthlyBudget() {
    const title = "January Budget";

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Container id="income" className='table' maxWidth="sm">
                    <CustomTable title="Income" />
                </Container>
            </Box>
        </Container>
    );
}