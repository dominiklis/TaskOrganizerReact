import { Grid } from "@material-ui/core";
import React from "react";
import { constStrings } from "../utils/constants";
import Page from "./Page";
import PageTitle from "./PageTitle";
import SharedByMeTasks from "./SharedByMeTasks";
import SharedToMeTasks from "./SharedToMeTasks";

function SharedTasksPage() {
  return (
    <Page>
      <Grid container>
        <Grid item xs={12} sm={11}>
          <PageTitle title={constStrings.sharedTasks} />
          <SharedToMeTasks />
          <SharedByMeTasks />
        </Grid>
        <Grid item sm={1} display={{ xs: "none" }}></Grid>
      </Grid>
    </Page>
  );
}

export default SharedTasksPage;
