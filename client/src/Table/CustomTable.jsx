import { React, useState } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import InsertButton from "../InsertButton/InsertButton";

const CustomTable = (props) => {
  const [incomes, setIncomes] = useState([
    {
      name: "Job",
      expected: 3000,
      actual: 3500
    },
    {
      name: "Bonuri de masa",
      expected: 300,
      actual: 200
    }
  ]);

  return (
    <Container maxWidth="sm">
      <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e", color: "white", padding: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
          {props.title}
        </Typography>

        <Table sx={{ minWidth: 300 }} aria-label="income table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Expected</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actual</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              incomes.map((income) => {
                return (
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>{income.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{income.actual}</TableCell>
                    <TableCell sx={{ color: "white" }}>{income.expected}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <InsertButton list={incomes} setList={setIncomes} />
    </Container >
  );
};

export default CustomTable;
