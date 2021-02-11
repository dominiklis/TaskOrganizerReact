import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from "@material-ui/pickers";
import { Tasks } from "../apicalls/requests";
import React from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  submitButton: {
    marginTop: theme.spacing(2),
  },
  inputField: {
    marginTop: theme.spacing(1),
  },
  dateTimePickerGridItem: {
    textAlign: "center",
  },
  dates: {
    marginTop: theme.spacing(1),
  },
}));

const validationSchema = yup.object({
  title: yup.string("enter title").required("title is required"),
  description: yup.string().nullable(),
  tags: yup.string().nullable(),
  startDate: yup.date(),
  startTime: yup.date().nullable(),
  hours: yup.number().min(0).max(24),
  minutes: yup.number().min(0).max(59),
});

function TaskForm({ task }) {
  const history = useHistory();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      title: task ? task.title : "",
      description: task ? task.description : "",
      priority: "0",
      tags: task ? task.tags : "",
      startDate: task ? new Date(task.startDate) : new Date(),
      startTime: task && task.hasStartTime ? new Date(task.startDate) : null,
      hours:
        task && task.endDate
          ? parseInt(
              Math.abs(new Date(task.startDate) - new Date(task.endDate)) /
                (1000 * 60 * 60)
            )
          : "0",
      minutes:
        task && task.endDate
          ? ((Math.abs(new Date(task.startDate) - new Date(task.endDate)) /
              (1000 * 60 * 60)) %
              1) *
            60
          : "0",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newTask = {
        title: values.title,
        description: values.description,
        priority: parseInt(values.priority),
        tags: [],
        completed: false,
        startDate: new Date(values.startDate.setHours(0, 0, 0, 0)),
        hasStartTime: false,
        endDate: null,
      };

      if (values.tags) {
        let newTags = values.tags.split(" ");
        newTags.forEach((tag) => {
          tag = tag.replace(/\W/g, "");
          if (tag.length > 0 && tag.match(/^[0-9a-z]+$/)) {
            newTask.tags.push(tag);
          }
        });
      }

      if (values.startTime) {
        newTask.startDate.setHours(
          values.startTime.getHours(),
          values.startTime.getMinutes(),
          0,
          0
        );
        newTask.hasStartTime = true;
      }

      if (
        newTask.hasStartTime &&
        (values.hours !== "0" || values.minutes !== "0")
      ) {
        if (!values.hours) {
          values.hours = 0;
        }

        if (!values.minutes) {
          values.minutes = 0;
        }

        newTask.endDate = new Date(
          newTask.startDate.getTime() +
            parseInt(values.hours) * 60 * 60 * 1000 +
            parseInt(values.minutes) * 60 * 1000
        );
      }

      Tasks.add(newTask);
      //history.push("/");
      //history.go();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="title"
        className={classes.inputField}
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />

      <Box display="flex">
        <Box flexGrow={1}>
          <TextField
            fullWidth
            multiline
            rows={4}
            id="description"
            name="description"
            label="description"
            className={classes.inputField}
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </Box>

        <Box>
          <Typography component="legend" className={classes.inputField}>
            task priority
          </Typography>
          <RadioGroup
            row
            aria-label="priority"
            name="priority"
            defaultValue="0"
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="0"
              control={<Radio color="primary" />}
              label="low"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="1"
              control={<Radio color="primary" />}
              label="medium"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="2"
              control={<Radio color="primary" />}
              label="high"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </Box>
      </Box>

      <TextField
        fullWidth
        id="tags"
        name="tags"
        label="tags (separate with spaces)"
        className={classes.inputField}
        value={formik.values.tags}
        onChange={formik.handleChange}
        error={formik.touched.tags && Boolean(formik.errors.tags)}
        helperText={formik.touched.tags && formik.errors.tags}
      />

      <Grid container spacing={3} className={classes.dates}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12} sm={4} className={classes.dateTimePickerGridItem}>
            <DatePicker
              fullWidth
              id="startDate"
              name="startDate"
              label="start date"
              value={formik.values.startDate}
              onChange={(date) =>
                formik.setFieldValue("startDate", date, false)
              }
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
            />
          </Grid>

          <Grid item xs={12} sm={4} className={classes.dateTimePickerGridItem}>
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
                formik.touched.startTime && Boolean(formik.errors.startTime)
              }
            />
          </Grid>
        </MuiPickersUtilsProvider>

        <Grid item xs={6} sm={2} className={classes.dateTimePickerGridItem}>
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

        <Grid item xs={6} sm={2} className={classes.dateTimePickerGridItem}>
          <TextField
            id="minutes"
            name="minutes"
            label="minutes"
            type="number"
            value={formik.values.minutes}
            onChange={formik.handleChange}
            error={formik.touched.minutes && Boolean(formik.errors.minutes)}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        type="submit"
        fullWidth
        className={classes.submitButton}
        color="secondary"
      >
        submit
      </Button>
    </form>
  );
}

export default TaskForm;
