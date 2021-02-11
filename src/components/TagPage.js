import {
  Box,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory, useParams } from "react-router-dom";
import Page from "./Page";
import TaskList from "./TaskList";
import TodayIcon from "@material-ui/icons/Today";
import { format } from "date-fns";
import { Tags } from "../apicalls/requests";
import { CheckUser } from "../apicalls/auth";

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    color: "#0d7377",
  },
  dayDate: {
    marginTop: theme.spacing(2),
  },
  todayIcon: {
    marginRight: theme.spacing(1),
  },
}));

function TagPage() {
  const history = useHistory();
  const classes = useStyles();
  const { tagName } = useParams();

  const [groupedTasks, setGroupedTasks] = useState({});
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => {
    const user = CheckUser();

    if (user) {
      Tags.list(tagName).then((response) => {
        if (response.status === 200) {
          setGroupedTasks(response.data);
          setTasksLoaded(true);
        } else {
          console.log("ERROR" + response);
        }
      });
    } else {
      history.push("/signin");
    }
  }, [history, tagName]);

  return (
    <Page>
      {tasksLoaded ? (
        <Fragment>
          <Box>
            <Typography variant="h6">{`tasks tagged with ${tagName}`}</Typography>
          </Box>

          {groupedTasks.map((group) => {
            return (
              <Fragment key={group.key}>
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

                <TaskList tasks={group.tasks} />
              </Fragment>
            );
          })}
        </Fragment>
      ) : (
        <CircularProgress className={classes.circularProgress} />
      )}
    </Page>
  );
}

export default TagPage;
