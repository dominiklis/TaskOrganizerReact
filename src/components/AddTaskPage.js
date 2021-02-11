import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { constStrings } from "../utils/constants";
import Page from "./Page";
import TaskForm from "./TaskForm";

function AddTaskPage() {
  return (
    <Page>
      <Grid container>
        <Grid item xs={12} sm={11}>
          <Typography variant="h6">{constStrings.addNewTask}</Typography>
          <TaskForm />
        </Grid>
        <Grid item sm={1} display={{ xs: "none" }}></Grid>
      </Grid>
    </Page>
  );
}

export default AddTaskPage;
