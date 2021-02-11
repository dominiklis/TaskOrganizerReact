import { CircularProgress, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Tasks } from "../apicalls/requests";
import Page from "./Page";
import PageTitle from "./PageTitle";
import TaskGroupsList from "./TaskGroupsList";
import { constStrings } from "../utils/constants";
import { CheckUser } from "../apicalls/auth";
import { TaskRequestParams } from "../utils/params";

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    color: "#0d7377",
  },
}));

function SearchPage() {
  const history = useHistory();
  const classes = useStyles();
  const [groupedTasks, setGroupedTasks] = useState({});
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const { searchString } = useParams();

  useEffect(() => {
    const user = CheckUser();
    if (!user) {
      history.push("/signin");
    }

    const params = {
      startDate: 0,
      endDate: TaskRequestParams.nextYear(),
      sortOrder: TaskRequestParams.sortOrderDesc,
      search: searchString,
    };

    Tasks.list(params).then((response) => {
      if (response.status === 200) {
        setGroupedTasks(response.data);
        setTasksLoaded(true);
      } else {
        history.push("/NotFound");
      }
    });
  }, [history, searchString]);

  return (
    <Page>
      {tasksLoaded ? (
        <Fragment>
          <PageTitle
            title={`${constStrings.searchResults} for "${searchString}"`}
          />
          <TaskGroupsList tasks={groupedTasks} showGroupNames={true} />
        </Fragment>
      ) : (
        <CircularProgress className={classes.circularProgress} />
      )}
    </Page>
  );
}

export default SearchPage;
