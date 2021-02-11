import {
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { CheckUser } from "../apicalls/auth";
import { Tasks } from "../apicalls/requests";
import { TaskRequestParams } from "../utils/params";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import CollapseTasksList from "./CollapseTasksList";
import { constStrings } from "../utils/constants";

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.secondary.main,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  link: {
    textDecoration: "none",
    color: "#666666",
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

function OverdueTasks() {
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
      endDate: TaskRequestParams.today(),
      sortOrder: TaskRequestParams.sortOrderAsc,
      completed: false,
      limit: 5,
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

  return (
    <Fragment>
      {tasksLoaded ? (
        <Fragment>
          {groupedTasks.length ? (
            <Fragment>
              <CollapseTasksList
                tasks={groupedTasks}
                title={`OVERDUE TASKS (${
                  groupedTasks.reduce((a, b) => ({
                    count: a.count + b.count,
                  })).count
                })`}
                titleStyle={classes.title}
                icon={<EventBusyIcon className={classes.icon} />}
                showGroupNames={true}
                linkButton={
                  <Link to={"/overdue"} className={classes.link}>
                    <Button>go to overdue</Button>
                  </Link>
                }
              />
            </Fragment>
          ) : (
            <Typography variant="h5">{constStrings.noOverdueTasks}</Typography>
          )}
        </Fragment>
      ) : (
        <CircularProgress color="primary" />
      )}
    </Fragment>
  );
}

export default OverdueTasks;
