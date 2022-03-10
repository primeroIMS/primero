import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector } from "../../../libs";
import { getRecordsData } from "../../index-table";

import { NAME } from "./constants";

const Component = ({ close, open, record, recordType, currentPage, selectedRecords }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const selectedIds = buildSelectedIds(selectedRecords, records, currentPage, "short_id");

  const handleOk = () => {
    console.log(selectedIds);
    // dispatch();
    // close();
  };

  return (
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={i18n.t("cases.mark_for_offline.title")}
      dialogText={i18n.t("cases.mark_for_offline.text")}
      confirmButtonLabel={i18n.t("cases.ok")}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  currentPage: PropTypes.number,
  open: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object
};

export default Component;
