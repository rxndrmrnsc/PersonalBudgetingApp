import { React, useState, useEffect, useRef } from "react";
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CustomTable = (props) => {
  const [editing, setEditing] = useState(-1); // -1 means no row is being edited
  const [tempName, setTempName] = useState("");
  const [tempExpected, setTempExpected] = useState(0);
  const [tempActual, setTempActual] = useState(0);

  const initialRows = props.rows.map((row, index) => ({
    ...row,
    id: row.id || index + 1_000, // avoid overlap with future manually added ids
  }));

  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    setRows(
      props.rows.map((row, index) => ({
        ...row,
        id: row.id || index + 1_000,
      }))
    );
  }, [props.rows, editing]);

  const changeRowsParent = props.changeRows;

  const idRef = useRef(100);

  const getNewId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const handleEdit = (id) => {
    const row = rows.find((r) => r.id === id);
    setEditing(id);
    setTempName(row.name);
    setTempExpected(row.expected);
    setTempActual(row.actual);
    changeRowsParent(rows);
  };

  const handleSave = (id, tempName, tempExpected, tempActual) => {
    var newRows = rows.map((row) =>
      row.id === id ? { ...row, name: tempName, expected: tempExpected, actual: tempActual } : row
    )
    setRows(newRows);
    changeRowsParent(newRows);
    setEditing(-1);
  };

  const handleCancel = () => {
    setEditing(-1);
  };

  const onClickInsert = () => {
    const newItem = {
      id: getNewId(),
      name: "New item",
      expected: 0,
      actual: 0
    }
    const updatedRows = [...rows, newItem];
    setRows(updatedRows);
    changeRowsParent(updatedRows);
  }

  const handleDelete = (id) => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
    changeRowsParent(newRows);
  };

  return (
    <Container maxWidth="sm">
      <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e", color: "white", padding: 2, overflowX: "auto" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
          {props.title}
        </Typography>

        <Table sx={{ width: "100%" }} aria-label="income table">
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
              rows.map((income) => {
                const isEditing = editing === income.id;

                return (
                  <TableRow key={income.id}>
                    {isEditing ? (
                      <>
                        <TableCell sx={{ color: "white" }}>
                          <TextField
                            sx={{ input: { color: 'white' } }}
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <TextField
                            sx={{ input: { color: 'white' } }}
                            value={tempExpected}
                            onChange={(e) => setTempExpected(e.target.value)}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <TextField
                            sx={{ input: { color: 'white' } }}
                            value={tempActual}
                            onChange={(e) => setTempActual(e.target.value)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleSave(income.id, tempName, tempExpected, tempActual)} color="success">
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
                        <TableCell sx={{ color: "white" }}>{income.expected}</TableCell>
                        <TableCell sx={{ color: "white" }}>{income.actual}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(income.id)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(income.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          backgroundColor: "#4f378b",
          color: "white",
          "&:hover": { backgroundColor: "#3d2a6d" }, // Darker shade on hover
          textTransform: "none", // Keep text case as is
          fontWeight: "bold",
        }}
        onClick={onClickInsert}
      >
        Insert new entry
      </Button>
    </Container >
  );
};

export default CustomTable;
