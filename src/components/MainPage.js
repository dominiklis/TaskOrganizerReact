import React from "react";
import Page from "./Page";
import { constStrings } from "../utils/constants";
import OverdueTasks from "./OverdueTasks";
import ActiveTasks from "./ActiveTasks";
import PageTitle from "./PageTitle";
import { Grid } from "@material-ui/core";

function MainPage() {
  return (
    <Page>
      <Grid container>
        <Grid item xs={12} sm={11}>
          <OverdueTasks />
          <PageTitle title={constStrings.activeTasks} />
          <ActiveTasks />
        </Grid>
        <Grid item sm={1} display={{ xs: "none" }}></Grid>
      </Grid>
    </Page>
  );
}

export default MainPage;
