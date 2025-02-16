import { React, useState, useEffect } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InsertButton from "../InsertButton/InsertButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const CustomTable = (props) => {
  const [rows, setRows] = useState([
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
  const [editing, setEditing] = useState(-1); // -1 means no row is being edited

  useEffect(() => {
    // TODO: check if this works + check if editing works
  }, [rows]);


  const handleEdit = (id) => {
    setEditing(id);
  };

  const handleSave = (id, tempName, tempExpected, tempActual) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, name: tempName, expected: tempExpected, actual: tempActual } : row
      )
    );
    setEditing(-1);
  };

  const handleCancel = () => {
    setEditing(-1);
  };

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
              <TableCell sx={{ color: "white", fontWeight: "bold", align: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              rows.map((income, index) => {
                const isEditing = editing === index;
                const [tempName, setTempName] = useState(income.name);
                const [tempExpected, setTempExpected] = useState(income.expected);
                const [tempActual, setTempActual] = useState(income.actual);

                return (
                  <TableRow key={index}>
                    {isEditing ? (
                      <>
                        <TableCell sx={{ color: "white" }}>
                          <TextField
                            sx={{ color: "white" }}
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <TextField
                            sx={{ color: "white" }}
                            value={tempActual}
                            onChange={(e) => setTempActual(e.target.value)}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <TextField
                            sx={{ color: "white" }}
                            value={tempExpected}
                            onChange={(e) => setTempExpected(e.target.value)}
                          />
                        </TableCell>
                        <TableCell align="right">

                          <IconButton onClick={() => handleSave(index, tempName, tempExpected, tempActual)} color="success">
                            <CheckIcon />
                          </IconButton>
                          <IconButton onClick={handleCancel} color="error">
                            <CloseIcon />
                          </IconButton>
                        </TableCell>

                      </>
                    ) : (
                      <>
                        <TableCell sx={{ color: "white" }}>{income.name}</TableCell>
                        <TableCell sx={{ color: "white" }}>{income.actual}</TableCell>
                        <TableCell sx={{ color: "white" }}>{income.expected}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(index)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </>
                    )}


                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <InsertButton list={rows} setList={setRows} />
    </Container >
  );
};

export default CustomTable;
