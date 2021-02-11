import { Button, InputBase, makeStyles } from "@material-ui/core";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  input: {
    padding: theme.spacing(0.5),
    background: "#f0f0f0",
  },
  button: {
    marginBottom: theme.spacing(1),
  },
}));

function AddNoteForm() {
  const classes = useStyles();
  
  const [note, setNote] = useState("");

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (note !== "") {
      console.log("NOTE: " + note);
      setNote("");
    }
  };

  const handleAddNoteInputChange = (e) => {
    let noteText = e.target.value;
    setNote(noteText);
  };

  return (
    <div>
      <form onSubmit={handleAddNoteSubmit} className={classes.form}>
        <InputBase
          multiline
          rows={4}
          value={note}
          onChange={handleAddNoteInputChange}
          fullWidth
          placeholder="add note"
          className={classes.input}
        />
        <Button fullWidth type="submit" className={classes.button}>
          add
        </Button>
      </form>
    </div>
  );
}

export default AddNoteForm;
