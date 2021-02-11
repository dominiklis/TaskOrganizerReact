import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Fragment } from "react";
import {
  Box,
  Button,
  Collapse,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Notes } from "../../apicalls/requests";
import DetailsIcon from "@material-ui/icons/Details";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import NoteCard from "./NoteCard";
import { constStrings } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  textWithIcon: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    "flex-wrap": "wrap",
    color: "#0d7377",
  },
  addNoteText: {
    marginBottom: theme.spacing(1),
  },
  addNoteButton: {
    marginBottom: theme.spacing(1),
  },
}));

const validationSchema = yup.object({
  newNoteText: yup.string().required(),
});

function TaskNotes({ isAuthor, taskId, notes, openSnackbar }) {
  const classes = useStyles();

  const [show, setShow] = useState(false);
  const [taskNotes, setTaskNotes] = useState(notes);

  const handleClick = () => {
    let s = !show;
    setShow(s);
  };

  const handleDeleteStep = (id) => {
    let nNotes = taskNotes.filter((x) => x.id !== id);
    setTaskNotes(nNotes);
  };

  const formik = useFormik({
    initialValues: {
      newNoteText: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      const note = {
        text: values.newNoteText,
        taskId: taskId,
      };
      Notes.add(note).then((response) => {
        if (response.status === 201) {
          const nNotes = taskNotes;
          nNotes.push(response.data);
          setTaskNotes(nNotes);
          openSnackbar(constStrings.noteAdded);

          actions.resetForm({
            values: {
              newNoteText: "",
            },
          });
        } else {
          openSnackbar(constStrings.somethingWentWrongTryAganin);
        }
      });
    },
  });

  return (
    <Fragment>
      <Box
        display="flex"
        className={classes.textWithIcon}
        onClick={handleClick}
      >
        <Box flexGrow={1} className={classes.addNoteText}>
          <Typography>add new note:</Typography>
        </Box>
        <Box>{show ? <ChangeHistoryIcon /> : <DetailsIcon />}</Box>
      </Box>
      <Collapse in={show}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            color="secondary"
            variant="outlined"
            id="newNoteText"
            name="newNoteText"
            label="add note"
            value={formik.values.newNoteText}
            onChange={formik.handleChange}
            placeholder="add note (max 180)"
            error={
              formik.touched.newNoteText && Boolean(formik.errors.newNoteText)
            }
            helperText={formik.touched.newNoteText && formik.errors.newNoteText}
            inputProps={{ maxLength: 180 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className={classes.addNoteButton}
          >
            add note
          </Button>
        </form>
      </Collapse>

      <Grid container spacing={1}>
        {taskNotes.map((note) => (
          <NoteCard
            key={note.id}
            isAuthor={isAuthor}
            note={note}
            handleDeleteStep={handleDeleteStep}
            openSnackbar={openSnackbar}
          />
        ))}
      </Grid>
    </Fragment>
  );
}

export default TaskNotes;
