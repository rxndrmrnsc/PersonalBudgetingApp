import React from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import InsertButton from "../InsertButton/InsertButton";

const CustomTable = (props) => {
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
            <TableRow>
              <TableCell sx={{ color: "white" }}>Job</TableCell>
              <TableCell sx={{ color: "white" }}>3500</TableCell>
              <TableCell sx={{ color: "white" }}>3600</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <InsertButton />
    </Container>
  );
};

export default CustomTable;
