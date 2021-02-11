import {
  CircularProgress,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { Fragment } from "react";
import { useState } from "react";
import { CheckUser } from "../apicalls/auth";
import { TaskRequestParams } from "../utils/params";
import { Tasks } from "../apicalls/requests";
import { useHistory } from "react-router-dom";
import TaskGroupsList from "./TaskGroupsList";
import PriorityFilteringMenu from "./PriorityFilteringMenu";
import { filterTasksByPriority } from "../utils/utils";
import { constStrings } from "../utils/constants";
import CurrentDate from "./CurrentDate";

function ActiveTasks() {
  const history = useHistory();

  const [groupedTasks, setGroupedTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [priority, setPriority] = useState(null);
  const [dateParams, setDateParams] = useState({
    start: TaskRequestParams.today(),
    end: TaskRequestParams.nextWeek(),
  });

  useEffect(() => {
    const user = CheckUser();
    if (!user) {
      history.push("/signin");
    }

    const params = {
      startDate: dateParams.start,
      endDate: dateParams.end,
      sortOrder: TaskRequestParams.sortOrderAsc,
    };

    Tasks.list(params).then((response) => {
      if (response.status === 200) {
        setGroupedTasks(response.data);
        setTasksLoaded(true);
      } else {
        console.log("ERROR" + response);
      }
    });
  }, [history, dateParams]);

  if (tasksLoaded) {
    return (
      <Fragment>
        <CurrentDate dateParams={dateParams} setDateParams={setDateParams} prevDisabled={dateParams.start === TaskRequestParams.today()} />
        <Typography>priority:</Typography>
        <PriorityFilteringMenu setPriority={setPriority} />
        <TaskGroupsList
          tasks={filterTasksByPriority(priority, groupedTasks)}
          showGroupNames={true}
          info={constStrings.noActiveTasks}
        />
        {groupedTasks.length > 0 && (
          <CurrentDate dateParams={dateParams} setDateParams={setDateParams} />
        )}
      </Fragment>
    );
  }

  return <CircularProgress color="primary" />;
}

export default ActiveTasks;
