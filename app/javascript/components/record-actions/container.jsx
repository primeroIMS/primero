// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { createElement } from "react";

import { RECORD_TYPES, MODULES } from "../../config";
import { useI18n } from "../i18n";
import { getFiltersValueByRecordType } from "../index-filters/selectors";
import { getMetadata } from "../record-list/selectors";
import { useApp } from "../application";
import { usePermissions } from "../permissions";
import Menu from "../menu";
import { useDialog } from "../action-dialog";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import useIncidentFromCase from "../records/use-incident-form-case";
import { getRecordFormsByUniqueIdWithFallback, getServicesRecordForm } from "../record-form/selectors";
import { selectRecordsByIndexes } from "../records";
import { currentUser } from "../user";

import { INCIDENT_SUBFORM, INCIDENTS_SUBFORM_NAME } from "./add-incident/constants";
import { SERVICES_SUBFORM_NAME } from "./add-service/constants";
import {
  REQUEST_APPROVAL_DIALOG,
  APPROVAL_DIALOG,
  NOTES_DIALOG,
  REFER_DIALOG,
  TRANSFER_DIALOG,
  ASSIGN_DIALOG,
  EXPORT_DIALOG,
  SERVICE_DIALOG,
  INCIDENT_DIALOG,
  RECORD_ACTION_ABILITIES,
  ID_SEARCH,
  ENABLE_DISABLE_DIALOG,
  OPEN_CLOSE_DIALOG,
  MARK_FOR_OFFLINE_DIALOG,
  LINK_INCIDENT_TO_CASE_DIALOG
} from "./constants";
import { NAME } from "./config";
import { isDisabledAction, buildApprovalList, buildActionList, subformExists } from "./utils";

function Container({
  currentPage,
  mode,
  record,
  recordType,
  selectedRecords = [],
  clearSelectedRecords,
  showListActions
}) {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const { currentDialog, dialogClose, dialogOpen, pending, setDialog, setDialogPending } = useDialog([
    APPROVAL_DIALOG,
    ASSIGN_DIALOG,
    ENABLE_DISABLE_DIALOG,
    EXPORT_DIALOG,
    INCIDENT_DIALOG,
    NOTES_DIALOG,
    OPEN_CLOSE_DIALOG,
    REFER_DIALOG,
    REQUEST_APPROVAL_DIALOG,
    SERVICE_DIALOG,
    TRANSFER_DIALOG,
    MARK_FOR_OFFLINE_DIALOG,
    LINK_INCIDENT_TO_CASE_DIALOG
  ]);
  const { handleCreateIncident } = useIncidentFromCase({ record, mode });
  const selectedRecordsFromList = useMemoizedSelector(state =>
    selectRecordsByIndexes(state, recordType, selectedRecords[currentPage])
  );
  const primeroModule = (selectedRecordsFromList?.[0] || record)?.get("module_id");

  const isIdSearch = useMemoizedSelector(state => getFiltersValueByRecordType(state, recordType, ID_SEARCH) || false);
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const incidentForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueIdWithFallback(state, {
      checkVisible: false,
      formName: INCIDENT_SUBFORM,
      primeroModule,
      recordType: RECORD_TYPES[recordType],
      fallbackModule: MODULES.CP
    })
  ).first();
  const serviceForm = useMemoizedSelector(state =>
    getServicesRecordForm(state, {
      checkVisible: false,
      primeroModule,
      recordType: RECORD_TYPES[recordType],
      fallbackModule: MODULES.CP
    })
  );
  const user = useMemoizedSelector(state => currentUser(state));

  const handleDialogClick = dialog => {
    setDialog({ dialog, open: true });
  };

  const hasIncidentSubform = subformExists(incidentForm, INCIDENTS_SUBFORM_NAME);
  const hasServiceSubform = subformExists(serviceForm, SERVICES_SUBFORM_NAME);

  const totalRecords = metadata?.get("total", 0);
  const enableState = record && record.get("record_state") ? "disable" : "enable";
  const openState = record && record.get("status") === "open" ? "close" : "reopen";

  const {
    canAddIncident,
    canAddNotes,
    canAddService,
    canApprove,
    canSelfApprove,
    canApproveActionPlan,
    canApproveBia,
    canApproveCasePlan,
    canApproveClosure,
    canApproveGbvClosure,
    canAssign,
    canClose,
    canCreateIncident,
    canEnable,
    canRefer,
    canReopen,
    canRequest,
    canRequestActionPlan,
    canRequestBia,
    canRequestCasePlan,
    canRequestClosure,
    canRequestGbvClosure,
    canShowExports,
    canTransfer,
    canOnlyExportPdf,
    permittedAbilities,
    canMarkForOffline,
    canLinkIncidentToCase
  } = usePermissions(recordType, RECORD_ACTION_ABILITIES);

  const canOpenOrClose = (canReopen && openState === "reopen") || (canClose && openState === "close");

  const { approvals, requestsApproval } = buildApprovalList({
    approvalsLabels,
    canApproveActionPlan,
    canApproveBia,
    canApproveCasePlan,
    canApproveClosure,
    canApproveGbvClosure,
    canRequestActionPlan,
    canRequestBia,
    canRequestCasePlan,
    canRequestClosure,
    canRequestGbvClosure,
    record
  });

  const selectedRowsIndex =
    (selectedRecords && Boolean(Object.keys(selectedRecords).length) && selectedRecords[currentPage]) || [];

  const { actions, dialogs } = buildActionList({
    approvals,
    canAddIncident,
    canAddNotes,
    canAddService,
    canApprove: record?.get("owned_by") === user ? canApprove && canSelfApprove : canApprove,
    canAssign,
    canCreateIncident,
    canEnable,
    canOpenOrClose,
    canRefer,
    canRequest,
    canShowExports,
    canMarkForOffline,
    canLinkIncidentToCase,
    canTransfer,
    canOnlyExportPdf,
    enableState,
    handleDialogClick,
    hasIncidentSubform,
    hasServiceSubform,
    i18n,
    isIdSearch,
    isShow: mode.isShow,
    openState,
    record,
    recordType,
    requestsApproval,
    showListActions,
    handleCreateIncident
  });

  const showMenu = mode.isShow && !isEmpty(actions);
  const disabledCondition = ({ enabledFor, enabledOnSearch }) =>
    showListActions && isDisabledAction(enabledFor, enabledOnSearch, isIdSearch, selectedRecords, totalRecords);

  const { ability, component, props } = dialogs?.[currentDialog] || {};

  return (
    <>
      <Menu showMenu={showMenu} actions={actions} disabledCondition={disabledCondition} />
      {ability &&
        createElement(component, {
          ...props,
          close: dialogClose,
          currentDialog,
          currentPage,
          open: dialogOpen[currentDialog],
          pending,
          record,
          recordType,
          selectedRecords,
          clearSelectedRecords,
          selectedRowsIndex,
          setPending: setDialogPending,
          userPermissions: permittedAbilities,
          mode,
          primeroModule
        })}
    </>
  );
}

Container.displayName = NAME;

Container.propTypes = {
  clearSelectedRecords: PropTypes.func,
  currentPage: PropTypes.number,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  showListActions: PropTypes.bool
};

export default Container;
