import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

import { PageHeading } from "../../page";
import RecordActions from "../../record-actions";
import Permission from "../../application/permission";
import { CREATE_RECORDS } from "../../../libs/permissions";
import AddRecordMenu from "../add-record-menu";

import { NAME } from "./constants";

const Component = ({
  title,
  recordType,
  handleDrawer,
  mobileDisplay,
  selectedRecords,
  clearSelectedRecords,
  currentPage
}) => {
  return (
    <PageHeading title={title}>
      {mobileDisplay && (
        <IconButton onClick={handleDrawer} color="primary">
          <FilterListIcon />
        </IconButton>
      )}
      <Permission resources={recordType} actions={CREATE_RECORDS}>
        <AddRecordMenu recordType={recordType} />
      </Permission>
      <RecordActions
        currentPage={currentPage}
        clearSelectedRecords={clearSelectedRecords}
        selectedRecords={selectedRecords}
        recordType={recordType}
        mode={{ isShow: true }}
        showListActions
      />
    </PageHeading>
  );
};

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  currentPage: PropTypes.number,
  handleDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  title: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
