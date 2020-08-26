import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

import { PageHeading } from "../../page";
import RecordActions from "../../record-actions";
import Permission from "../../application/permission";
import { CREATE_RECORDS } from "../../../libs/permissions";
import AddRecordMenu from "../add-record-menu";
import { useI18n } from "../../i18n";

import { NAME } from "./constants";

const Component = ({ title, recordType, handleDrawer, mobileDisplay, selectedRecords, currentPage, css }) => {
  const i18n = useI18n();

  return (
    <Box mb={3} alignItems="center" display="flex" className={css.toolbar}>
      <Box flexGrow={1}>
        <PageHeading title={title} mobileHeading />
      </Box>
      <Box>
        {mobileDisplay && (
          <IconButton aria-label={i18n.t("buttons.filter_label")} onClick={handleDrawer} color="primary">
            <FilterListIcon />
          </IconButton>
        )}
        <Permission resources={recordType} actions={CREATE_RECORDS}>
          <AddRecordMenu recordType={recordType} />
        </Permission>
        <RecordActions
          currentPage={currentPage}
          selectedRecords={selectedRecords}
          recordType={recordType}
          mode={{ isShow: true }}
          showListActions
        />
      </Box>
    </Box>
  );
};

Component.propTypes = {
  css: PropTypes.object,
  currentPage: PropTypes.number,
  handleDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  title: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
