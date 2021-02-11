import {
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Page from "../Page";
import { CheckUser, IsAuthor, GetUserName } from "../../apicalls/auth";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TaskTitle from "./TaskTitle";
import { Tasks, Users, UserTasks } from "../../apicalls/requests";
import TaskDates from "./TaskDates";
import TaskTags from "./TaskTags";
import TaskDescription from "./TaskDescription";
import TaskDetailsTabs from "./TaskDetailsTabs";
import Priority from "./Priority";
import { Fragment } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { constStrings } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  completedText: {
    color: "#c0c0c0",
  },
  notCompletedText: {
    color: "#808080",
  },
  sharedText: {
    color: "#6e0110",
  },
  deleteIconButton: {
    color: theme.palette.warning.main,
  },
}));

function TaskDetailsPage({ match }) {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [task, setTask] = useState({});
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [added, setAdded] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [tags, setTags] = useState([]);

  // completing tasks
  const handleCompletedFormSubmit = (e) => {
    e.preventDefault();
    const t = !taskCompleted;
    setTaskCompleted(t);

    Tasks.patch(task.id, [
      {
        op: "replace",
        path: "/Completed",
        value: t,
      },
    ]).then((response) => {
      if (response.status === 204) {
        taskCompleted
          ? openSnackbar(constStrings.taskCompleted)
          : openSnackbar(constStrings.taskIncomplete);
      }
    });
  };

  // cancel sharing
  const submitCancelSharing = (e) => {
    e.preventDefault();
    UserTasks.unshare({ email: GetUserName(), taskId: id }).then((response) => {
      if (response.status === 204) {
        history.push("/");
        history.go();
      }
    });
  };

  const handleDeleteButtonClick = () => {
    Tasks.delete(id);
    history.goBack();
  };

  // users with access to this task
  const [usersToList, setUsersToList] = useState([]);

  // author info
  const [author, setAuthor] = React.useState(false);

  // snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSbar, setOpenSbar] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSbar(false);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSbar(true);
  };

  useEffect(() => {
    const user = CheckUser();
    if (!user) {
      history.push("/signin");
    }

    Tasks.details(id).then((response) => {
      if (response.status === 200) {
        setTask(response.data);
        setAdded(new Date(response.data.added));
        setStartDate(new Date(response.data.startDate));
        if (response.data.endDate) {
          setEndDate(new Date(response.data.endDate));
        }
        setTaskCompleted(response.data.completed);
        setTags(response.data.tags);
        setAuthor(IsAuthor(response.data.authorName));
        setTaskLoaded(true);
      } else {
        history.push("/NotFound");
      }
    });

    Users.listUsersWithTask(id).then((response) => {
      if (response.status === 200) {
        setUsersToList(response.data);
      }
    });
  }, [id, history]);

  if (taskLoaded) {
    return (
      <Page>
        <Grid container spacing={1} className={classes.root}>
          <Grid item xs={1}>
            {IsAuthor(task.authorName) ? (
              <Box textAlign="center">
                <Tooltip
                  title={
                    taskCompleted ? "mark as incomplete" : "mark as completed"
                  }
                >
                  <form onSubmit={handleCompletedFormSubmit}>
                    <IconButton
                      color={`${taskCompleted ? "secondary" : "primary"}`}
                      type="submit"
                    >
                      {taskCompleted ? <ClearIcon /> : <CheckIcon />}
                    </IconButton>
                  </form>
                </Tooltip>
                <Tooltip title="delete">
                  <div>
                    <IconButton
                      className={classes.deleteIconButton}
                      onClick={handleDeleteButtonClick}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </div>
                </Tooltip>
              </Box>
            ) : (
              <form onSubmit={submitCancelSharing}>
                <Tooltip title="cancel sharing">
                  <IconButton edge="end" aria-label="delete" type="submit">
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </form>
            )}
          </Grid>

          <Grid item xs={11} sm={10}>
            {!IsAuthor(task.authorName) && (
              <Typography
                variant="caption"
                className={classes.sharedText}
              >{`task shared by ${task.authorName}`}</Typography>
            )}

            <TaskTitle
              isAuthor={author}
              taskId={task.id}
              taskTitle={task.title}
              openSnackbar={openSnackbar}
            />

            <Priority
              isAuthor={author}
              taskId={task.id}
              taskPriority={task.priority}
              openSnackbar={openSnackbar}
            />

            {taskCompleted ? (
              <Typography variant="body1" className={classes.completedText}>
                completed
              </Typography>
            ) : (
              <Typography variant="body1" className={classes.notCompletedText}>
                not completed
              </Typography>
            )}

            <TaskDates
              isAuthor={author}
              taskId={task.id}
              added={added}
              sDate={startDate}
              eDate={endDate}
              startTime={task.hasStartTime}
              openSnackbar={openSnackbar}
            />

            <TaskTags
              isAuthor={author}
              taskId={task.id}
              taskTags={tags}
              openSnackbar={openSnackbar}
            />

            <TaskDescription
              isAuthor={author}
              taskId={task.id}
              taskDescription={task.description}
              openSnackbar={openSnackbar}
            />

            <TaskDetailsTabs
              isAuthor={author}
              taskId={task.id}
              steps={task.steps}
              notes={task.notes}
              usersToList={usersToList}
              openSnackbar={openSnackbar}
            />
          </Grid>

          <Grid item sm={1} display={{ xs: "none" }}></Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={openSbar}
          autoHideDuration={4000}
          onClose={handleClose}
          message={snackbarMessage}
          action={
            <Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fragment>
          }
        ></Snackbar>
      </Page>
    );
  }

  return (
    <Page>
      <CircularProgress color="primary" />
    </Page>
  );
}

export default TaskDetailsPage;
