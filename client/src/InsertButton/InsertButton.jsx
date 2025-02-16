import React from "react";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const InsertButton = (props) => {
  const onClickInsert = () => {
    const newItem = {
      name: "New item",
      expected: 0,
      actual: 0
    }

    let list = [...props.list, newItem]
    props.setList(list)
  }

  return (
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
  );
};

export default InsertButton;
