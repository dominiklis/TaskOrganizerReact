import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React from "react";
import ClearIcon from "@material-ui/icons/Clear";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const useStyles = makeStyles((theme) => ({
  listItemIcon: {
    color: "#d3d3d3",
  },
}));

function TaskShareListItem({ userName, onUnshareButtonClick }) {
  const classes = useStyles();

  const handleUnshare = () => {
    onUnshareButtonClick(userName);
  };

  return (
    <ListItem>
      <ListItemIcon className={classes.listItemIcon}>
        <RadioButtonUncheckedIcon />
      </ListItemIcon>
      <ListItemText>
        <Typography>{userName}</Typography>
      </ListItemText>
      <ListItemSecondaryAction>
        <Tooltip title="remove access">
          <IconButton edge="end" aria-label="unshare" onClick={handleUnshare}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default TaskShareListItem;
