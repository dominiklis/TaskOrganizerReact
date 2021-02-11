import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Fragment } from "react";
import TaskCard from "./TaskCard";
import TodayIcon from "@material-ui/icons/Today";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  dayDate: {
    marginTop: theme.spacing(2),
  },
  todayIcon: {
    marginRight: theme.spacing(1),
  },
}));

function TaskGroupsList({ tasks, showGroupNames, info }) {
  const classes = useStyles();

  return (
    <Fragment>
      {tasks.length ? (
        <Fragment>
          {tasks.map((group) => {
            return (
              <Fragment key={group.key}>
                {showGroupNames && (
                  <Box display="flex" className={classes.dayDate}>
                    <Box>
                      <TodayIcon className={classes.todayIcon} />
                    </Box>
                    <Box>
                      <Typography variant="h5">
                        {format(new Date(group.key), "dd.MM.yyyy")}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {group.tasks.map((task) => {
                  return <TaskCard task={task} key={task.id} />;
                })}
              </Fragment>
            );
          })}
        </Fragment>
      ) : (
        <Typography variant="h5">{info}</Typography>
      )}
    </Fragment>
  );
}

export default TaskGroupsList;
