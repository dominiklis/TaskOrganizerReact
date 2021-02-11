import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { CheckUser } from "../apicalls/auth";
import { TaskRequestParams } from "../utils/params";
import CollapseTasksList from "./CollapseTasksList";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Tasks } from "../apicalls/requests";

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.secondary.main,
  },
  icon: {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(1),
  },
}));

function SharedByMeTasks() {
  const history = useHistory();
  const classes = useStyles();

  const [groupedTasks, setGroupedTasks] = useState({});
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => {
    const user = CheckUser();
    if (!user) {
      history.push("/signin");
    }

    const params = {
      startDate: 0,
      endDate: TaskRequestParams.nextWeek(),
      sortOrder: TaskRequestParams.sortOrderAsc,
      shared: "SharedBy",
    };

    Tasks.list(params).then((response) => {
      if (response.status === 200) {
        setGroupedTasks(response.data);
        setTasksLoaded(true);
      } else {
        console.log("ERROR" + response);
      }
    });
  }, [history]);

  if (tasksLoaded) {
    return (
      <Fragment>
        {groupedTasks.length ? (
          <CollapseTasksList
            tasks={groupedTasks}
            title={`TASKS SHARED BY ME (${
              groupedTasks.reduce((a, b) => ({
                count: a.count + b.count,
              })).count
            })`}
            titleStyle={classes.title}
            icon={<ArrowBackIcon className={classes.icon} />}
            showGroupNames={true}
          />
        ) : (
          <Typography variant="h5">{"you didn't share any tasks"}</Typography>
        )}
      </Fragment>
    );
  }

  return <CircularProgress color="primary" />;
}

export default SharedByMeTasks;
