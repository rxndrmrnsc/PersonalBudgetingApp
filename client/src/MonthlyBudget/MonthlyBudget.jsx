import { React, useState, useEffect } from "react";
import { Button, Container, IconButton, Grid2, Typography, Box, Switch, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import CustomTable from '../Table/CustomTable'
import BudgetPieChart from '../PieChart/BudgetPieChart'

export default function MonthlyBudget(props) {
    const incomeString = "Income";
    const needsString = "Needs";
    const wantsString = "Wants";
    const savingsString = "Savings";

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
        ],
        expenses: {
            needs: [
                {
                    id: 2,
                    name: "Groceries",
                    expected: 450,
                    actual: 600
                },
                {
                    id: 3,
                    name: "Rent",
                    expected: 2500,
                    actual: 2500
                }
            ],
            wants: [
                {
                    id: 4,
                    name: "Eating out",
                    expected: 250,
                    actual: 400
                },
                {
                    id: 5,
                    name: "Rent",
                    expected: 2500,
                    actual: 2500
                }
            ]
        },
        savings: [
            {
                id: 6,
                name: "Savings",
                expected: 2500,
                actual: 1500
            },
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
        if (section === incomeString) {
            newBudget = {
                ...budget,
                income: rows,
            };
        } else if (section === needsString) {
            newBudget = {
                ...budget,
                expenses: {
                    needs: rows,
                    wants: budget.expenses.wants
                }
            };
        } else if (section === wantsString) {
            newBudget = {
                ...budget,
                expenses: {
                    needs: budget.expenses.needs,
                    wants: rows
                }
            };
        } else if (section === savingsString) {
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
                    <CustomTable title={incomeString} rows={budget.income} changeRows={(rows) => handleChange(rows, incomeString)} />
                </Grid2>
                <Grid2 item size={6}>
                    <BudgetPieChart
                        income={getTotal(budget.income)}
                        needs={getTotal(budget.expenses.needs)}
                        wants={getTotal(budget.expenses.wants)}
                        savings={getTotal(budget.savings)}
                    />
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography>Expected</Typography>
                        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handlePieChartChange} />
                        <Typography>Actual</Typography>
                    </Stack>
                </Grid2>

                {/* Row 2: Expenses (Needs + Wants) */}
                <Grid2 item size={12}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                        Expenses
                    </Typography>
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title={needsString} rows={budget.expenses.needs} changeRows={(rows) => handleChange(rows, needsString)} />
                </Grid2>
                <Grid2 item size={6}>
                    <CustomTable title={wantsString} rows={budget.expenses.wants} changeRows={(rows) => handleChange(rows, wantsString)} />
                </Grid2>

                {/* Row 3: Savings */}
                <Grid2 item size={6}>
                    <CustomTable title={savingsString} rows={budget.savings} changeRows={(rows) => handleChange(rows, savingsString)} />
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
                        onClick={handleReturn}
                    >
                        Save and return
                    </Button>

                </Grid2>
            </Grid2>
        </Box>
    );
}