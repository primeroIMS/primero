import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddRecordMenu from "./AddRecordMenu";
import styles from "./styles.css";

const RecordListToolbar = ({
  title,
  recordType,
  handleDrawer,
  mobileDisplay
}) => {
  const css = makeStyles(styles)();

  return (
    <Box mb={3} alignItems="center" display="flex" className={css.toolbar}>
      <Box flexGrow={1}>
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
      </Box>
      <Box>
        {mobileDisplay && (
          <IconButton onClick={handleDrawer}>
            <FilterListIcon />
          </IconButton>
        )}
        <AddRecordMenu recordType={recordType} />
      </Box>
    </Box>
  );
};

RecordListToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  handleDrawer: PropTypes.func.isRequired
};

export default RecordListToolbar;
