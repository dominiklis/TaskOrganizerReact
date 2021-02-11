import { Chip, makeStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  tagLink: {
    marginRight: theme.spacing(1),
    color: "#0d5537",
    textDecoration: "none",
    "&:hover": {
      color: "#037c81",
      textDecoration: "none",
    },
  },
}));

function TagChip({ tag }) {
  const classes = useStyles();
  return (
    <Link to={`/tag/${tag}`} className={classes.tagLink} key={tag}>
      <Chip variant="outlined" size="small" label={tag} clickable />
    </Link>
  );
}

export default TagChip;
