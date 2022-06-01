import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector } from "../../../libs";
import { getRecordsData } from "../../index-table";
import { getMarkForMobileLoading, markForOffline } from "../../records";
import { RECORD_TYPES_PLURAL } from "../../../config";

import { NAME } from "./constants";

const Component = ({ close, open, recordType, currentPage, selectedRecords, clearSelectedRecords }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const markedForMobileLoadingCases = useMemoizedSelector(state => getMarkForMobileLoading(state, recordType));
  const markedForMobileLoadingRegistry = useMemoizedSelector(state =>
    getMarkForMobileLoading(state, RECORD_TYPES_PLURAL.registry_record)
  );

  const selectedIds = buildSelectedIds(selectedRecords, records, currentPage, "id");
  const selectedRegistryIds = buildSelectedIds(selectedRecords, records, currentPage, "registry_record_id");

  const handleOk = () => {
    dispatch(markForOffline({ recordType, ids: selectedIds, selectedRegistryIds }));
    clearSelectedRecords();
  };

  return (
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={i18n.t(`${recordType}.mark_for_offline.title`)}
      dialogText={i18n.t(`${recordType}.mark_for_offline.text`)}
      confirmButtonLabel={i18n.t("cases.ok")}
      omitCloseAfterSuccess
      pending={markedForMobileLoadingCases || markedForMobileLoadingRegistry}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  close: PropTypes.func,
  currentPage: PropTypes.number,
  open: PropTypes.bool,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object
};

export default Component;
