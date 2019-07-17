import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddRecordMenu from "./AddRecordMenu";
import styles from "./styles.css";

const RecordListToolbar = ({ title, recordType }) => {
  const css = makeStyles(styles)();

  return (
    <Box mb={3} alignItems="center" display="flex" className={css.toolbar}>
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
