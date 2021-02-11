import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { format } from "date-fns";

function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <Typography variant="h5">
      {format(date, "dd.MM.yyyy - HH:mm:ss")}
    </Typography>
  );
}

export default Clock;
