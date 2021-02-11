import {
  Box,
  Button,
  List,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Fragment } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Steps } from "../../apicalls/requests";
import ListOfStepsItem from "./ListOfStepsItem";
import { constStrings } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  partName: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  addStepForm: {
    background: "#f0f0f0",
    marginTop: theme.spacing(1),
  },
  addStepButton: {
    height: "100%",
  },
}));

const validationSchema = yup.object({
  newStepText: yup.string("enter step text").required("text is required"),
});

function TaskSteps({ isAuthor, taskId, steps, openSnackbar }) {
  const classes = useStyles();

  const [taskSteps, setTaskSteps] = useState(steps);

  const formik = useFormik({
    initialValues: {
      newStepText: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      const newStep = {
        task: taskId,
        text: values.newStepText,
      };

      Steps.add(newStep).then((response) => {
        if (response.status === 201) {
          const nSteps = taskSteps;
          nSteps.push(response.data);
          setTaskSteps(nSteps);
          openSnackbar(constStrings.newStepAdded);

          actions.resetForm({
            values: {
              newStepText: "",
            },
          });
        }
      });
    },
  });

  const stepDelete = (id) => {
    let nSteps = taskSteps.filter((x) => x.id !== id);
    setTaskSteps(nSteps);
  };

  return (
    <Fragment>
      <Typography variant="subtitle2" className={classes.partName}>
        steps:
      </Typography>
      {isAuthor && (
        <form onSubmit={formik.handleSubmit} className={classes.addStepForm}>
          <Box display="flex" flexDirection="row">
            <Box flexGrow={4}>
              <TextField
                fullWidth
                variant="outlined"
                id="newStepText"
                name="newStepText"
                label="add new step"
                value={formik.values.newStepText}
                onChange={formik.handleChange}
                placeholder="add step"
                color="secondary"
                error={
                  formik.touched.newStepText &&
                  Boolean(formik.errors.newStepText)
                }
                helperText={
                  formik.touched.newStepText && formik.errors.newStepText
                }
              />
            </Box>
            <Box>
              <Button
                type="submit"
                className={classes.addStepButton}
                variant="contained"
                color="secondary"
              >
                add
              </Button>
            </Box>
          </Box>
        </form>
      )}

      {taskSteps && taskSteps.length > 0 && (
        <List>
          {taskSteps.map((step) => (
            <ListOfStepsItem
              step={step}
              key={step.id}
              handleDeleteStep={stepDelete}
              canEdit={isAuthor}
              openSnackbar={openSnackbar}
            />
          ))}
        </List>
      )}
    </Fragment>
  );
}

export default TaskSteps;
