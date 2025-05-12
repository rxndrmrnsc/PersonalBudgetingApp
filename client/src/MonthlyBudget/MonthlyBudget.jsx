import { React, useState, useEffect } from "react";
import { Button, Container, IconButton, Grid2, Typography, Box, Switch, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import CustomTable from '../Table/CustomTable'
import BudgetPieChart from '../PieChart/BudgetPieChart'

export default function MonthlyBudget(props) {
    const mockBuget = {
        income: [
            {
                id: 0,
                name: "Job",
                expected: 3000,
                actual: 2000
            },
            {
                id: 1,
                name: "Bonuri de masa",
                expected: 300,
                actual: 200
            }
        ]
    }
    const [checked, setChecked] = useState(false);
    const [budget, setBudget] = useState(mockBuget)
    const title = props.budgetId + " budget";

    useEffect(() => {
        console.log("Component re-rendered, budget is now:", budget);
    }, [checked, budget]);

    const handleReturn = () => {
        props.setActiveBudgetId(null);
    }


    const getTotal = (rows) => {
        if (checked == false)
            return rows.reduce((sum, row) => sum + Number(row.expected), 0)
        else
            return rows.reduce((sum, row) => sum + Number(row.actual), 0)
    };

    const handlePieChartChange = () => {
        setChecked(!checked)
    }

    const handleChange = (rows, section) => {
        let newBudget = { ...budget };
        if (section === "Income") {
            newBudget = {
              ...budget,
              income: rows,
            };
          } else if (section === "Expenses") {
            newBudget = {
              ...budget,
              expenses: rows,
            };
          } else if (section === "Savings") {
            newBudget = {
              ...budget,
              savings: rows,
            };
          }
        console.log(newBudget)

        setBudget(newBudget)
    }


    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#1890ff',
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#177ddc',
                    }),
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: theme.transitions.create(['width'], {
                duration: 200,
            }),
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
            ...theme.applyStyles('dark', {
                backgroundColor: 'rgba(255,255,255,.35)',
            }),
        },
    }));

    return (
        <Box maxWidth sx={{ padding: 2, width: '100%', minWidth: '300px', minHeight: '100vh' }}>

            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
                {title}
            </Typography>
            <Grid2 container rowSpacing={6} columnSpacing={4} columns={12}>
                {/* Row 1: Income & Pie Chart placeholder */}
                <Grid2 item size={6}>
                    <CustomTable title="Income" rows={budget.income} changeRows={(rows) => handleChange(rows, "Income")} />
                </Grid2>
                <Grid2 item size={6}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography>Expected</Typography>
                        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handlePieChartChange} />
                        <Typography>Actual</Typography>
                    </Stack>
                    <BudgetPieChart
                        income={getTotal(budget.income)}
                        needs={1000}
                        wants={500}
                        savings={350}
                    />
                </Grid2>

                {/* Row 2: Expenses (Needs + Wants) */}
                {/* <Grid2 item size={12}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                        Expenses
                    </Typography>
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title="Needs" rows={mockRows} />
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title="Wants" rows={mockRows} />
                </Grid2> */}

                {/* Row 3: Savings */}
                {/* <Grid2 item size={6}>
                    <CustomTable title="Savings" rows={mockRows} />
                </Grid2>
                <Grid2 item size={6}>
                </Grid2> */}


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
                        onClick={handleReturn}
                    >
                        Save and return
                    </Button>

                </Grid2>
            </Grid2>
        </Box>
    );
}