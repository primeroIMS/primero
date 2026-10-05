import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { DialogContentText } from "@mui/material";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector } from "../../../libs";
import { getRecordsData } from "../../index-table";
import { getMarkForMobileLoading, markForOffline } from "../../records";
import { RECORD_TYPES_PLURAL } from "../../../config";
import PendingTransitionAlert from "../pending-transition-alert";

import { NAME } from "./constants";

function Component({
  close,
  open,
  recordType,
  currentPage,
  selectedRecords,
  clearSelectedRecords,
  pendingTransitionIds = []
}) {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const markedForMobileLoadingCases = useMemoizedSelector(state => getMarkForMobileLoading(state, recordType));
  const markedForMobileLoadingRegistry = useMemoizedSelector(state =>
    getMarkForMobileLoading(state, RECORD_TYPES_PLURAL.registry_record)
  );

  const selectedIds = buildSelectedIds(selectedRecords, records, currentPage, "id", pendingTransitionIds);
  const selectedRegistryIds = buildSelectedIds(
    selectedRecords,
    records,
    currentPage,
    "registry_record_ids",
    pendingTransitionIds
  );

  const handleOk = () => {
    dispatch(markForOffline({ recordType, ids: selectedIds, selectedRegistryIds: selectedRegistryIds?.flat() }));
    clearSelectedRecords();
  };

  return (
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle={i18n.t(`${recordType}.mark_for_offline.title`)}
      confirmButtonLabel={i18n.t("cases.ok")}
      enabledSuccessButton={selectedIds.length > 0}
      omitCloseAfterSuccess
      pending={markedForMobileLoadingCases || markedForMobileLoadingRegistry}
    >
      <PendingTransitionAlert pendingTransitionIds={pendingTransitionIds} />
      <DialogContentText>{i18n.t(`${recordType}.mark_for_offline.text`)}</DialogContentText>
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  close: PropTypes.func,
  currentPage: PropTypes.number,
  open: PropTypes.bool,
  pendingTransitionIds: PropTypes.array,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object
};

export default Component;
