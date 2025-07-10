import { React, useState, useEffect } from "react";
import { Button, Container, IconButton, Grid2, Typography, Box, Switch, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import CustomTable from '../Table/CustomTable'
import BudgetPieChart from '../PieChart/BudgetPieChart'
import { getBudgetById, updateBudget } from "../api/api";

export default function MonthlyBudget(props) {
    const incomesString = "Incomes";
    const needsString = "Needs";
    const wantsString = "Wants";
    const savingsString = "Savings";

    const [checked, setChecked] = useState(false);
    const [budget, setBudget] = useState(props.budget);
    const title = budget.title || "Monthly Budget";

    useEffect(() => {
    }, [checked, budget]);

    const handleReturn = () => {
        console.log("Saving budget:", budget);
        updateBudget(props.budgetId, budget)
        props.onBack();
    }


    const getTotal = (rows) => {
        if (!rows || rows.length === 0) return 0;
        if (rows.length === 1) return Number(rows[0][checked ? 'actual' : 'expected']);
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
        if (section === incomesString) {
            newBudget = {
                ...budget,
                incomes: rows,
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
                {/* Row 1: Incomes & Pie Chart placeholder */}
                <Grid2 item size={6}>
                    <CustomTable title={incomesString} rows={budget.incomes} changeRows={(rows) => handleChange(rows, incomesString)} />
                </Grid2>
                <Grid2 item size={6}>
                    <BudgetPieChart
                        incomes={getTotal(budget.incomes)}
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
                            "&:hover": { backgroundColor: "#3d2a6d" },
                            textTransform: "none",
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