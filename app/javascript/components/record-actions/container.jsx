import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import isEmpty from "lodash/isEmpty";

import { RECORD_TYPES, RECORD_PATH, APPROVALS_TYPES, MODULES } from "../../config";
import { useI18n } from "../i18n";
import { getPermissionsByRecord } from "../user/selectors";
import { getFiltersValueByRecordType } from "../index-filters/selectors";
import DisableOffline from "../disable-offline";
import { ConditionalWrapper } from "../../libs";
import { getMetadata } from "../record-list/selectors";
import { useApp } from "../application";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import usePermissions from "../permissions";
import Menu from "../menu";
import { getRecordFormsByUniqueId } from "../record-form";
import { fetchIncidentFromCase } from "../records";

import { INCIDENT_SUBFORM, INCIDENTS_SUBFORM_NAME } from "./add-incident/constants";
import { SERVICES_SUBFORM, SERVICES_SUBFORM_NAME } from "./add-service/constants";
import { setDialog, setPending } from "./action-creators";
import {
  REQUEST_APPROVAL_DIALOG,
  APPROVAL_DIALOG,
  APPROVAL_TYPE,
  REQUEST_TYPE,
  REFER_DIALOG,
  TRANSFER_DIALOG,
  ASSIGN_DIALOG,
  EXPORT_DIALOG,
  ENABLED_FOR_ONE,
  ENABLED_FOR_ONE_MANY,
  ENABLED_FOR_ONE_MANY_ALL,
  SERVICE_DIALOG,
  INCIDENT_DIALOG,
  RECORD_ACTION_ABILITIES,
  ID_SEARCH
} from "./constants";
import { NAME } from "./config";
import Notes from "./notes";
import ToggleEnable from "./toggle-enable";
import ToggleOpen from "./toggle-open";
import Transitions from "./transitions";
import AddIncident from "./add-incident";
import AddService from "./add-service";
import RequestApproval from "./request-approval";
import Exports from "./exports";
import { selectDialog, selectDialogPending } from "./selectors";
import { isDisabledAction, buildApprovalList, buildActionList, subformExists } from "./utils";

const Container = ({ recordType, record, mode, showListActions, currentPage, selectedRecords }) => {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const dispatch = useDispatch();

  const currentDialog = useSelector(state => selectDialog(state, ASSIGN_DIALOG));
  const isIdSearch = useSelector(state => getFiltersValueByRecordType(state, recordType, ID_SEARCH) || false);
  const metadata = useSelector(state => getMetadata(state, recordType));

  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };

  const handleDialogClick = (dialog, open) => {
    console.log(dialog, open);
    dispatch(setDialog({ dialog, open }));
  };

  const incidentForm = useSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: MODULES.CP,
      formName: INCIDENT_SUBFORM,
      checkVisible: false
    })
  ).first();

  const serviceForm = useSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: MODULES.CP,
      formName: SERVICES_SUBFORM,
      checkVisible: false
    })
  ).first();

  const hasIncidentSubform = subformExists(incidentForm, INCIDENTS_SUBFORM_NAME);
  const hasServiceSubform = subformExists(serviceForm, SERVICES_SUBFORM_NAME);

  const totalRecords = metadata?.get("total", 0);
  const enableState = record && record.get("record_state") ? "disable" : "enable";
  const openState = record && record.get("status") === "open" ? "close" : "reopen";

  const {
    canAddNotes,
    canReopen,
    canRefer,
    canClose,
    canEnable,
    canAssign,
    canTransfer,
    canRequest,
    canRequestBia,
    canRequestCasePlan,
    canRequestClosure,
    canRequestActionPlan,
    canRequestGbvClosure,
    canApprove,
    canApproveBia,
    canApproveCasePlan,
    canApproveClosure,
    canApproveActionPlan,
    canApproveGbvClosure,
    canAddIncident,
    canAddService,
    canShowExports,
    canCreateIncident
  } = usePermissions(recordType, RECORD_ACTION_ABILITIES);

  // const handleItemAction = itemAction => {
  //   handleClose();
  //   itemAction();
  // };

  // const transitionsProps = {
  //   record,
  //   transitionType,
  //   setTransitionType,
  //   recordType,
  //   userPermissions,
  //   referDialog,
  //   transferDialog,
  //   assignDialog,
  //   handleReferClose: () => setReferDialog(false),
  //   handleTransferClose: () => setTransferDialog(false),
  //   handleAssignClose: () => setAssignDialog(false),
  //   pending: dialogPending,
  //   setPending: setDialogPending,
  //   currentPage,
  //   selectedRecords
  // };

  const canOpenOrClose = (canReopen && openState === "reopen") || (canClose && openState === "close");

  // const toggleEnableDialog = (
  //   <ToggleEnable
  //     close={handleEnableDialogClose}
  //     openEnableDialog={openEnableDialog}
  //     record={record}
  //     recordType={recordType}
  //   />
  // );

  // const toggleOpenDialog = (
  //   <ToggleOpen
  //     close={handleReopenDialogClose}
  //     openReopenDialog={openReopenDialog}
  //     record={record}
  //     recordType={recordType}
  //   />
  // );

  const { approvals, requestsApproval } = buildApprovalList({
    approvalsLabels,
    canApproveActionPlan,
    canApproveBia,
    canApproveCasePlan,
    canApproveClosure,
    canApproveGbvClosure,
    canRequestBia,
    canRequestCasePlan,
    canRequestClosure,
    canRequestActionPlan,
    canRequestGbvClosure
  });

  // const allowedRequestsApproval = filterItems(requestsApproval);
  // const allowedApprovals = filterItems(approvals);
  // const selectedRecordsOnCurrentPage =
  //   (selectedRecords && Boolean(Object.keys(selectedRecords).length) && selectedRecords[currentPage]) || [];

  const dialogs = {
    addIncident: {
      component: AddIncident,
      ability: canAddIncident
    },
    export: {
      component: Exports,
      ability: canShowExports
    }
  }[currentDialog || "export"];

  const actions = buildActionList({
    dispatch,
    record,
    i18n,
    handleDialogClick,
    openState,
    enableState,
    isShow: mode.isShow,
    isIdSearch,
    showListActions,
    recordType,
    canRefer,
    canAssign,
    canTransfer,
    canAddIncident,
    canAddService,
    canOpenOrClose,
    canEnable,
    canRequest,
    canApprove,
    canAddNotes,
    canShowExports,
    canCreateIncident,
    hasIncidentSubform,
    hasServiceSubform
  });

  const showMenu = mode.isShow && !isEmpty(actions);
  const disabledCondtion = ({ enabledFor, enabledOnSearch }) =>
    showListActions && isDisabledAction(enabledFor, enabledOnSearch, isIdSearch, selectedRecords, totalRecords);

  return (
    <>
      <Menu showMenu={showMenu} actions={actions} disabledCondtion={disabledCondtion} />
      {currentDialog &&
        dialogs.ability &&
        React.createElement(dialogs.component, {
          openExportsDialog: () => {
            console.log("here");
          },
          close: () => {},
          recordType,
          // userPermissions,
          record,
          currentPage,
          selectedRecords,
          pending: () => {},
          setPending: setDialogPending
        })}

      {/* {canOpenOrClose ? toggleOpenDialog : null}

      {canEnable && toggleEnableDialog}

      <Transitions {...transitionsProps} />

      {canAddIncident && (
        <AddIncident
          openIncidentDialog={incidentDialog}
          close={() => setIncidentDialog(false)}
          recordType={recordType}
          records={[]}
          selectedRowsIndex={selectedRecordsOnCurrentPage}
          pending={dialogPending}
          setPending={setDialogPending}
        />
      )}

      {canAddService && (
        <AddService
          openServiceDialog={serviceDialog}
          close={() => setServiceDialog(false)}
          recordType={recordType}
          selectedRowsIndex={selectedRecordsOnCurrentPage}
          pending={dialogPending}
          setPending={setDialogPending}
        />
      )}

      {canAddNotes && (
        <Notes close={handleNotesClose} openNotesDialog={openNotesDialog} record={record} recordType={recordType} />
      )}

      {canRequest && (
        <RequestApproval
          openRequestDialog={requestDialog}
          close={() => handleRequestClose()}
          subMenuItems={allowedRequestsApproval}
          record={record}
          recordType={recordType}
          pending={dialogPending}
          setPending={setDialogPending}
          approvalType={approvalType}
          confirmButtonLabel={i18n.t("buttons.ok")}
          dialogName={REQUEST_APPROVAL_DIALOG}
        />
      )}

      {canApprove && (
        <RequestApproval
          openRequestDialog={approveDialog}
          close={() => handleApprovalClose()}
          subMenuItems={allowedApprovals}
          record={record}
          recordType={recordType}
          pending={dialogPending}
          setPending={setDialogPending}
          approvalType={approvalType}
          confirmButtonLabel={i18n.t("buttons.submit")}
          dialogName={APPROVAL_DIALOG}
        />
      )}

      {canShowExports && (
        <Exports
          openExportsDialog={openExportsDialog}
          close={() => setOpenExportsDialog(false)}
          recordType={recordType}
          userPermissions={userPermissions}
          record={record}
          currentPage={currentPage}
          selectedRecords={selectedRecords}
          pending={dialogPending}
          setPending={setDialogPending}
        />
      )} */}
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  currentPage: PropTypes.number,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  showListActions: PropTypes.bool
};

export default Container;
