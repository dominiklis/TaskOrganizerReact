import { CircularProgress, Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import { TaskRequestParams } from "../utils/params";
import { constStrings } from "../utils/constants";
import { useHistory } from "react-router-dom";
import { Tasks } from "../apicalls/requests";
import { CheckUser } from "../apicalls/auth";
import TaskGroupsList from "./TaskGroupsList";
import PriorityFilteringMenu from "./PriorityFilteringMenu";
import { filterTasksByPriority } from "../utils/utils";
import CurrentDate from "./CurrentDate";
import PageTitle from "./PageTitle";

function DoneTasksPage() {
  const history = useHistory();

  const [groupedTasks, setGroupedTasks] = useState({});
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [priority, setPriority] = useState(null);
  const [dateParams, setDateParams] = useState({
    start: TaskRequestParams.prevWeek(),
    end: TaskRequestParams.today(),
  });

  useEffect(() => {
    const user = CheckUser();
    if (!user) {
      history.push("/signin");
    }

    const params = {
      startDate: dateParams.start,
      endDate: dateParams.end,
      sortOrder: TaskRequestParams.sortOrderDesc,
      completed: true,
    };

    Tasks.list(params).then((response) => {
      if (response.status === 200) {
        setGroupedTasks(response.data);
        setTasksLoaded(true);
      } else {
        history.push("/NotFound");
      }
    });
  }, [history, dateParams]);

  if (tasksLoaded) {
    return (
      <Page>
        <Grid container>
          <Grid item xs={12} sm={11}>
            <PageTitle title={constStrings.completedTasks} />

            <PriorityFilteringMenu setPriority={setPriority} />

            <CurrentDate
              dateParams={dateParams}
              setDateParams={setDateParams}
              nextDisabled={dateParams.end === TaskRequestParams.today()}
            />

            <TaskGroupsList
              tasks={filterTasksByPriority(priority, groupedTasks)}
              showGroupNames={true}
              info={constStrings.noTasksToShow}
            />

            {groupedTasks.length > 0 && (
              <CurrentDate
                dateParams={dateParams}
                setDateParams={setDateParams}
                nextDisabled={dateParams.end === TaskRequestParams.today()}
              />
            )}
          </Grid>
          <Grid item sm={1} display={{ xs: "none" }}></Grid>
        </Grid>
      </Page>
    );
  }

  return (
    <Page>
      <CircularProgress color="primary" />
    </Page>
  );
}

export default DoneTasksPage;
