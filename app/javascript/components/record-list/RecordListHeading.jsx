import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

const RecordListHeading = ({ title, recordType, primeroModule }) => {
  return (
    <Box mb={3} alignItems="center" display="flex">
      <Box flexGrow={1}>
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
      </Box>
      <Box>
        <IconButton to={`/${recordType}/${primeroModule}/new`} component={Link}>
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

RecordListHeading.propTypes = {
  title: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  primeroModule: PropTypes.string
};

export default RecordListHeading;
