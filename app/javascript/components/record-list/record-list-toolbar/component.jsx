import PropTypes from "prop-types";
import { Hidden, IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

import { PageHeading } from "../../page";
import RecordActions from "../../record-actions";
import Permission from "../../application/permission";
import { CREATE_RECORDS } from "../../../libs/permissions";
import AddRecordMenu from "../add-record-menu";

import { NAME } from "./constants";

const mode = { isShow: true };

const Component = ({ title, recordType, handleDrawer, selectedRecords, currentPage }) => {
  return (
    <PageHeading title={title}>
      <Hidden mdUp>
        <IconButton onClick={handleDrawer} color="primary">
          <FilterListIcon />
        </IconButton>
      </Hidden>
      <Permission resources={recordType} actions={CREATE_RECORDS}>
        <AddRecordMenu recordType={recordType} />
      </Permission>
      <RecordActions
        currentPage={currentPage}
        selectedRecords={selectedRecords}
        recordType={recordType}
        mode={mode}
        showListActions
      />
    </PageHeading>
  );
};

Component.propTypes = {
  currentPage: PropTypes.number,
  handleDrawer: PropTypes.func.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  title: PropTypes.string.isRequired
};

Component.displayName = NAME;

Component.whyDidYouRender = true;

export default Component;
