import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

import { PageHeading } from "../../page";
import RecordActions from "../../record-actions";
import Permission from "../../application/permission";
import { CREATE_RECORDS } from "../../../libs/permissions";
import AddRecordMenu from "../add-record-menu";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ title, recordType, handleDrawer, mobileDisplay, selectedRecords, currentPage }) => {
  return (
    <div className={css.container}>
      <div className={css.heading}>
        <PageHeading title={title} mobileHeading />
      </div>
      <div className={css.actions}>
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
          selectedRecords={selectedRecords}
          recordType={recordType}
          mode={{ isShow: true }}
          showListActions
        />
      </div>
    </div>
  );
};

Component.propTypes = {
  currentPage: PropTypes.number,
  handleDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  title: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
