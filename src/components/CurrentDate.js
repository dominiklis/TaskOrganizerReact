import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { format } from "date-fns";
import { TaskRequestParams } from "../utils/params";

const useStyles = makeStyles((theme) => ({
  currentDates: {
    marginLeft: "1.5em",
    marginRight: "1.5em",
  },
}));

function CurrentDate({dateParams, setDateParams, prevDisabled, nextDisabled}) {
  const classes = useStyles();

  const handlePrevWeek = () => {
    const newDates = {
      start: TaskRequestParams.getWeekBefore(dateParams.start),
      end: dateParams.start,
    };

    setDateParams(newDates);
  };

  const handleNextWeek = () => {
    const newDates = {
      start: dateParams.end,
      end: TaskRequestParams.getNextWeek(dateParams.end),
    };

    setDateParams(newDates);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      alignItems="center"
    >
      <Box>
        <Button
          color="secondary"
          variant="outlined"
          disabled={prevDisabled}
          onClick={handlePrevWeek}
        >
          &lt;
        </Button>
      </Box>
      <Box>
        <Typography className={classes.currentDates}>{`${format(
          dateParams.start * 1000,
          "dd.MM"
        )} - ${format(
          TaskRequestParams.getDayBefore(dateParams.end) * 1000,
          "dd.MM"
        )}`}</Typography>
      </Box>
      <Box>
        <Button color="secondary" variant="outlined" 
        
        disabled={nextDisabled}
        onClick={handleNextWeek}>
          &gt;
        </Button>
      </Box>
    </Box>
  );
}

export default CurrentDate;
