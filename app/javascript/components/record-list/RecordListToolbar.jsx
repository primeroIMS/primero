import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import AddRecordMenu from "./AddRecordMenu";

const RecordListToolbar = ({ title, recordType }) => {
  return (
    <Box mb={3} alignItems="center" display="flex">
      <Box flexGrow={1}>
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
      </Box>
      <Box>
        <AddRecordMenu recordType={recordType} />
      </Box>
    </Box>
  );
};

RecordListToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default RecordListToolbar;
