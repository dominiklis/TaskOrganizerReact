import { Box, Collapse, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Fragment } from "react";
import DetailsIcon from "@material-ui/icons/Details";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import TaskGroupsList from "./TaskGroupsList";

const useStyles = makeStyles((theme) => ({
  textWithIcon: {
    display: "flex",
    alignItems: "center",
    "flex-wrap": "wrap",
  },
  collapse: {
    marginBottom: "1.5em",
  },
}));

function CollapseTasksList({
  tasks,
  icon,
  title,
  titleStyle,
  showGroupNames,
  linkButton,
}) {
  const classes = useStyles();
  const [show, setShow] = useState(false);

  const handleClick = () => {
    let s = !show;
    setShow(s);
  };
  return (
    <Fragment>
      <Box className={classes.textWithIcon} onClick={handleClick}>
        <Box>{icon}</Box>
        <Box flexGrow={1}>
          <Typography variant="h5" className={titleStyle}>
            {title}
          </Typography>
        </Box>
        <Box>
          {show ? (
            <ChangeHistoryIcon className={titleStyle} />
          ) : (
            <DetailsIcon className={titleStyle} />
          )}
        </Box>
      </Box>

      <Collapse in={show} className={classes.collapse}>
        <TaskGroupsList tasks={tasks} showGroupNames={showGroupNames} />
        {linkButton && (
          <Box display="flex" justifyContent="center">
            {linkButton}
          </Box>
        )}
      </Collapse>
    </Fragment>
  );
}

export default CollapseTasksList;
