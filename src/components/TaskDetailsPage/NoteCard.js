import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { GetUserName } from "../../apicalls/auth";
import { format } from "date-fns";
import { Notes } from "../../apicalls/requests";
import EditNoteTextForm from "./EditNoteTextForm";
import { constStrings } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  date: {
    fontSize: 12,
  },
  author: {
    fontSize: 14,
  },
  card: {
    height: "100%",
    background: "#f0f5f5",
  },
}));

function NoteCard({ isAuthor, note, handleDeleteStep, openSnackbar }) {
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [edited, setEdited] = useState(note.edited);
  const [noteText, setNoteText] = useState(note.text);

  const changeTextEditState = () => {
    const e = !edit;
    setEdit(e);
  };

  const handleDeleteNote = (e) => {
    e.preventDefault();
    Notes.delete(note.id).then((response) => {
      if (response.status === 204) {
        openSnackbar(constStrings.noteRemoved);
        handleDeleteStep(note.id);
      } else {
        openSnackbar(constStrings.somethingWentWrongTryAganin);
      }
    });
  };

  const handleSaveEditTextButton = (text) => {
    setNoteText(text);
    setEdited(true);
    changeTextEditState();
  };

  let actions;
  if (GetUserName() === note.authorName) {
    actions = (
      <CardActions>
        <form onSubmit={handleDeleteNote}>
          <Button type="submit" size="small" color="secondary">
            delete
          </Button>
        </form>

        <Button size="small" onClick={changeTextEditState}>
          {edit ? "cancel" : "edit"}
        </Button>
      </CardActions>
    );
  } else if (isAuthor) {
    actions = (
      <CardActions>
        <form onSubmit={handleDeleteNote}>
          <Button type="submit" size="small" color="secondary">
            delete
          </Button>
        </form>
      </CardActions>
    );
  } else {
    <CardActions></CardActions>;
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        {actions}
        <CardContent>
          <Typography
            className={classes.date}
            color="textSecondary"
            gutterBottom
          >
            {`${format(new Date(note.added), "dd.MM.yyyy")} ${
              edited ? " (edited)" : ""
            }`}
          </Typography>
          <Typography
            className={classes.author}
            color="textSecondary"
            gutterBottom
          >
            {note.authorName}
          </Typography>
          {edit ? (
            <EditNoteTextForm
              id={note.id}
              text={noteText}
              afterSubmit={handleSaveEditTextButton}
              handleCancel={changeTextEditState}
              openSnackbar={openSnackbar}
            />
          ) : (
            <Typography variant="body1" component="p">
              {noteText}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default NoteCard;
