import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FilterListIcon from "@material-ui/icons/FilterList";

import { PageHeading } from "../page";
import RecordActions from "../record-actions";
import Permission from "../application/permission";
import { PERMISSION_CONSTANTS } from "../../libs/permissions";

import AddRecordMenu from "./add-record-menu";
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
        <PageHeading title={title} />
      </Box>
      <Box>
        {mobileDisplay && (
          <IconButton onClick={handleDrawer} color="primary">
            <FilterListIcon />
          </IconButton>
        )}
        <Permission
          permissionType={recordType}
          permission={[PERMISSION_CONSTANTS.CREATE, PERMISSION_CONSTANTS.MANAGE]}>
          <AddRecordMenu recordType={recordType} />
        </Permission>
        <RecordActions recordType={recordType} iconColor="primary" />
      </Box>
    </Box>
  );
};

RecordListToolbar.propTypes = {
  handleDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default RecordListToolbar;
