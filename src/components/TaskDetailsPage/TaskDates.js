import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Fragment } from "react";
import { format } from "date-fns";
import TodayIcon from "@material-ui/icons/Today";
import * as yup from "yup";
import { Tasks } from "../../apicalls/requests";
import { useFormik } from "formik";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ClearIcon from "@material-ui/icons/Clear";
import { constStrings } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  timeBox: {
    width: "100%",
    borderRadius: "10px",
    padding: theme.spacing(1),
  },
  coloredText: {
    color: "#0d7377",
  },
  iconSpacing: {
    marginRight: theme.spacing(1),
  },
  textWithIcon: {
    display: "flex",
    alignItems: "center",
    "flex-wrap": "wrap",
    color: theme.palette.primary.main,
  },
  dateTimePickerGridItem: {
    textAlign: "center",
  },
}));

const validationSchema = yup.object({
  newStartDate: yup.date(),
  startTime: yup.date().nullable(),
  hours: yup.number().nullable().min(0).max(24),
  minutes: yup.number().nullable().min(0).max(59),
});

function TaskDates({
  isAuthor,
  taskId,
  added,
  sDate,
  eDate,
  startTime,
  openSnackbar,
}) {
  const classes = useStyles();

  const [editDates, setEditDates] = useState(false);
  const [startDate, setStartDate] = useState(sDate);
  const [endDate, setEndDate] = useState(eDate);
  const [hasStartTime, setHasStartTime] = useState(startTime);

  const changeEditDatesState = () => {
    if (isAuthor) {
      const e = !editDates;
      setEditDates(e);
    }
  };

  const clearStartTimeInput = () => {
    formik.setFieldValue("startTime", null, false);
  };

  const formik = useFormik({
    initialValues: {
      newStartDate: new Date(startDate),
      startTime: startTime ? new Date(startDate) : null,
      hours: endDate
        ? Math.round(
            parseInt(
              Math.abs(new Date(startDate) - new Date(endDate)) /
                (1000 * 60 * 60)
            )
          )
        : "0",
      minutes: endDate
        ? Math.round(
            ((Math.abs(new Date(startDate) - new Date(endDate)) /
              (1000 * 60 * 60)) %
              1) *
              60
          )
        : "0",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const updatedTask = {
        editDates: true,
        hasStartTime: hasStartTime,
        startDate: startDate,
        endDate: endDate,
      };

      updatedTask.startDate = new Date(
        values.newStartDate.setHours(0, 0, 0, 0)
      );
      updatedTask.hasStartTime = false;
      updatedTask.endDate = null;

      if (values.startTime) {
        updatedTask.startDate.setHours(
          values.startTime.getHours(),
          values.startTime.getMinutes(),
          0,
          0
        );
        updatedTask.hasStartTime = true;
      }

      if (
        updatedTask.hasStartTime &&
        (values.hours !== "0" || values.minutes !== "0")
      ) {
        updatedTask.endDate = new Date(
          updatedTask.startDate.getTime() +
            parseInt(values.hours) * 60 * 60 * 1000 +
            parseInt(values.minutes) * 60 * 1000
        );
      }

      if (
        (values.hours === "0" && values.minutes === "0") ||
        (values.hours === 0 && values.minutes === "0") ||
        (values.hours === "0" && values.minutes === 0) ||
        (values.hours === 0 && values.minutes === 0)
      ) {
        updatedTask.endDate = null;
      }

      Tasks.put(taskId, updatedTask).then((response) => {
        if (response.status === 204) {
          openSnackbar(constStrings.changesSaved);
          setStartDate(updatedTask.startDate);
          setHasStartTime(updatedTask.hasStartTime);
          setEndDate(updatedTask.endDate);
        } else {
          openSnackbar(constStrings.somethingWentWrongTryAganin);
        }
      });

      changeEditDatesState();
    },
  });

  return (
    <Box display="flex" className={classes.timeBox}>
      <Box textAlign="left">
        {editDates ? (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={classes.dateTimePickerGridItem}
                >
                  <DatePicker
                    fullWidth
                    id="newStartDate"
                    name="newStartDate"
                    label="start date"
                    value={formik.values.newStartDate}
                    onChange={(date) =>
                      formik.setFieldValue("newStartDate", date, false)
                    }
                    error={
                      formik.touched.newStartDate &&
                      Boolean(formik.errors.newStartDate)
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={classes.dateTimePickerGridItem}
                >
                  <Box display="flex">
                    <Box flexGrow={1}>
                      <TimePicker
                        fullWidth
                        id="startTime"
                        name="startTime"
                        label="start time"
                        ampm={false}
                        value={formik.values.startTime}
                        minutesStep={5}
                        onChange={(time) =>
                          formik.setFieldValue("startTime", time, false)
                        }
                        error={
                          formik.touched.startTime &&
                          Boolean(formik.errors.startTime)
                        }
                      />
                    </Box>
                    <Box>
                      <IconButton onClick={clearStartTimeInput}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              </MuiPickersUtilsProvider>

              <Grid
                item
                xs={6}
                sm={2}
                className={classes.dateTimePickerGridItem}
              >
                <TextField
                  id="hours"
                  name="hours"
                  label="hours"
                  type="number"
                  value={formik.values.hours}
                  onChange={formik.handleChange}
                  error={formik.touched.hours && Boolean(formik.errors.hours)}
                />
              </Grid>

              <Grid
                item
                xs={6}
                sm={2}
                className={classes.dateTimePickerGridItem}
              >
                <TextField
                  id="minutes"
                  name="minutes"
                  label="minutes"
                  type="number"
                  value={formik.values.minutes}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.minutes && Boolean(formik.errors.minutes)
                  }
                />
              </Grid>
            </Grid>

            <Button type="submit" color="secondary">
              save
            </Button>
            <Button onClick={changeEditDatesState}>cancel</Button>
          </form>
        ) : (
          <Fragment>
            <div
              className={classes.textWithIcon}
              onClick={changeEditDatesState}
            >
              <TodayIcon className={classes.iconSpacing} />
              <Typography variant="h6">
                {format(startDate, "dd.MM.yyyy")}
                {hasStartTime && ", " + format(startDate, "HH:mm")}
                {endDate && " - " + format(endDate, "HH:mm")}
              </Typography>
            </div>
          </Fragment>
        )}

        <Typography variant="subtitle1">
          {`added: ${format(added, "dd.MM.yyyy HH:mm")}`}
        </Typography>
      </Box>
      <Box textAlign="right" flexGrow={1}>
        <Box textAlign="right">
          <Box></Box>
          <Box></Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TaskDates;
