import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

function NoteCard({ note }) {
  const [added, setAdded] = useState(new Date());

  useEffect(() => {
    setAdded(new Date(note.added));
  }, [note.added]);

  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="subtitle2">
          {`${added.toLocaleDateString()} ${added.toLocaleTimeString()}`}
        </Typography>
        <Typography variant="body1">{note.text}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          edit
        </Button>
        <Button size="small" color="secondary">
          remove
        </Button>
      </CardActions>
    </Card>
  );
}

export default NoteCard;
