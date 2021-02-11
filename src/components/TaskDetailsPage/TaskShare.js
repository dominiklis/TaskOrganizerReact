import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Collapse,
  List,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { UserTasks } from "../../apicalls/requests";
import { Fragment } from "react";
import TaskShareListItem from "./TaskShareListItem";
import DetailsIcon from "@material-ui/icons/Details";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import { constStrings } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  shareForm: {
    background: "#f0f0f0",
    marginTop: theme.spacing(1),
  },
  shareButton: {
    height: "100%",
  },
  errorMsg: {
    color: "red",
  },
  partName: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  textWithIcon: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    "flex-wrap": "wrap",
    color: "#0d7377",
  },
}));

const validationSchema = yup.object({
  shareText: yup.string("enter email").required("email is required"),
});

function TaskShare({ isAuthor, taskId, usersToList, openSnackbar }) {
  const classes = useStyles();

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [users, setUsers] = useState(usersToList);
  const [show, setShow] = useState(false);

  const handleUnshare = (uName) => {
    UserTasks.unshare({ email: uName, taskId: taskId }).then((response) => {
      if (response.status === 204) {
        let u = users;
        u = u.filter((value) => value.userName !== uName);
        setUsers(u);
        openSnackbar(constStrings.endOfSharing);
      } else {
        openSnackbar(constStrings.somethingWentWrongTryAganin);
      }
    });
  };

  const handleClick = () => {
    let s = !show;
    setShow(s);
  };

  const formik = useFormik({
    initialValues: {
      shareText: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      UserTasks.share({ email: values.shareText, taskId: taskId }).then(
        (response) => {
          if (response.status === 201) {
            let nUsers = [
              ...users,
              { id: response.data.id, userName: response.data.userName },
            ];
            setUsers(nUsers);

            setIsError(false);
            setErrorMsg("");
            openSnackbar(constStrings.taskShared);

            actions.resetForm({
              values: {
                shareText: "",
              },
            });
          } else if (response.status === 204) {
            setIsError(true);
            setErrorMsg(constStrings.userAlreadyHasAccess);
          } else {
            setIsError(true);
            setErrorMsg(constStrings.userNotFound);
          }
        }
      );
    },
  });

  return (
    <Fragment>
      {isAuthor && (
        <Fragment>
          <Typography variant="subtitle2" className={classes.partName}>
            share this task with other users:
          </Typography>
          <form onSubmit={formik.handleSubmit} className={classes.shareForm}>
            <Box display="flex" flexDirection="row">
              <Box flexGrow={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="shareText"
                  name="shareText"
                  label="share this task"
                  type="email"
                  color="secondary"
                  value={formik.values.shareText}
                  onChange={formik.handleChange}
                  placeholder="add step"
                  error={
                    formik.touched.shareText && Boolean(formik.errors.shareText)
                  }
                  helperText={
                    formik.touched.shareText && formik.errors.shareText
                  }
                />
              </Box>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.shareButton}
                  color="secondary"
                >
                  share
                </Button>
              </Box>
            </Box>
          </form>
          {isError && (
            <Typography className={classes.errorMsg}>{errorMsg}</Typography>
          )}
        </Fragment>
      )}
      {users.length > 0 && isAuthor && (
        <Fragment>
          <Box
            display="flex"
            className={classes.textWithIcon}
            onClick={handleClick}
          >
            <Box flexGrow={1}>
              <Typography>users that have access to this task:</Typography>
            </Box>
            <Box>{show ? <ChangeHistoryIcon /> : <DetailsIcon />}</Box>
          </Box>

          <Collapse in={show}>
            <List>
              {users.map((user) => (
                <TaskShareListItem
                  key={user.id}
                  userName={user.userName}
                  onUnshareButtonClick={handleUnshare}
                />
              ))}
            </List>
          </Collapse>
        </Fragment>
      )}
    </Fragment>
  );
}

export default TaskShare;
