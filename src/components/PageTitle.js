import { Box, Typography } from "@material-ui/core";
import React from "react";
import Clock from "./Clock";

function PageTitle({ title }) {
  return (
    <Box display="flex" textAlign="right">
      <Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box flexGrow={1}>
        <Clock />
      </Box>
    </Box>
  );
}

export default PageTitle;
