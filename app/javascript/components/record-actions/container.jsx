import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { RECORD_TYPES, RECORD_PATH, APPROVALS_TYPES } from "../../config";
import { useI18n } from "../i18n";
import { getPermissionsByRecord } from "../user/selectors";
import { getFiltersValuesByRecordType } from "../index-filters/selectors";
import {
  ACTIONS,
  ENABLE_DISABLE_RECORD,
  ADD_NOTE,
  ADD_INCIDENT,
  ADD_SERVICE,
  REQUEST_APPROVAL,
  APPROVAL,
  SHOW_EXPORTS,
  checkPermissions
} from "../../libs/permissions";
import Permission from "../application/permission";
import DisableOffline from "../disable-offline";
import { ConditionalWrapper } from "../../libs";
import { getMetadata } from "../record-list/selectors";
import { useApp } from "../application";

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
  INCIDENT_DIALOG
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
import { isDisabledAction } from "./utils";

const Container = ({
  recordType,
  iconColor,
  record,
  mode,
  showListActions,
  currentPage,
  selectedRecords
}) => {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReopenDialog, setOpenReopenDialog] = useState(false);
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [approvalType, setApprovalType] = useState(APPROVAL_TYPE);
  const [transitionType, setTransitionType] = useState("");
  const [openEnableDialog, setOpenEnableDialog] = useState(false);
  const serviceDialog = useSelector(state =>
    selectDialog(SERVICE_DIALOG, state)
  );
  const incidentDialog = useSelector(state =>
    selectDialog(INCIDENT_DIALOG, state)
  );
  const requestDialog = useSelector(state =>
    selectDialog(REQUEST_APPROVAL_DIALOG, state)
  );
  const dialogPending = useSelector(state => selectDialogPending(state));
  const approveDialog = useSelector(state =>
    selectDialog(APPROVAL_DIALOG, state)
  );
  const referDialog = useSelector(state => selectDialog(REFER_DIALOG, state));
  const transferDialog = useSelector(state =>
    selectDialog(TRANSFER_DIALOG, state)
  );
  const assignDialog = useSelector(state => selectDialog(ASSIGN_DIALOG, state));
  const openExportsDialog = useSelector(state =>
    selectDialog(EXPORT_DIALOG, state)
  );
  const setRequestDialog = open => {
    dispatch(setDialog({ dialog: REQUEST_APPROVAL_DIALOG, open }));
  };
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };
  const setApproveDialog = open => {
    dispatch(setDialog({ dialog: APPROVAL_DIALOG, open }));
  };
  const setReferDialog = open => {
    dispatch(setDialog({ dialog: REFER_DIALOG, open }));
  };
  const setTransferDialog = open => {
    dispatch(setDialog({ dialog: TRANSFER_DIALOG, open }));
  };
  const setAssignDialog = open => {
    dispatch(setDialog({ dialog: ASSIGN_DIALOG, open }));
  };
  const setOpenExportsDialog = open => {
    dispatch(setDialog({ dialog: EXPORT_DIALOG, open }));
  };
  const setServiceDialog = open => {
    dispatch(setDialog({ dialog: SERVICE_DIALOG, open }));
  };
  const setIncidentDialog = open => {
    dispatch(setDialog({ dialog: INCIDENT_DIALOG, open }));
  };

  const metadata = useSelector(state => getMetadata(state, recordType));
  const totalRecords = metadata?.get("total", 0);

  const enableState =
    record && record.get("record_state") ? "disable" : "enable";

  const openState =
    record && record.get("status") === "open" ? "close" : "reopen";

  const assignPermissions = [
    ACTIONS.MANAGE,
    ACTIONS.ASSIGN,
    ACTIONS.ASSIGN_WITHIN_USER_GROUP,
    ACTIONS.ASSIGN_WITHIN_AGENCY_PERMISSIONS
  ];

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const idSearch = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType).get("id_search")
  );

  const isSearchFromList = Boolean(idSearch);

  const canAddNotes = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.ADD_NOTE
  ]);
  const canReopen = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REOPEN
  ]);

  const canRefer = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REFERRAL
  ]);

  const canClose = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.CLOSE
  ]);

  const canEnable = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.ENABLE_DISABLE_RECORD
  ]);

  const canAssign = checkPermissions(userPermissions, assignPermissions);

  const canTransfer = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.TRANSFER
  ]);

  const canRequest = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
    ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
    ACTIONS.REQUEST_APPROVAL_CLOSURE
  ]);

  const canRequestBia = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_ASSESSMENT
  ]);

  const canRequestCasePlan = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_CASE_PLAN
  ]);

  const canRequestClosure = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_CLOSURE
  ]);

  const canApprove = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.APPROVE_ASSESSMENT,
    ACTIONS.APPROVE_CASE_PLAN,
    ACTIONS.APPROVE_CLOSURE
  ]);

  const canApproveBia = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.APPROVE_ASSESSMENT
  ]);

  const canApproveCasePlan = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.APPROVE_CASE_PLAN
  ]);

  const canApproveClosure = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.APPROVE_CLOSURE
  ]);

  const canAddIncident = checkPermissions(userPermissions, ADD_INCIDENT);

  const canAddService = checkPermissions(userPermissions, ADD_SERVICE);

  const canShowExports = checkPermissions(userPermissions, SHOW_EXPORTS);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemAction = itemAction => {
    handleClose();
    itemAction();
  };

  const handleReopenDialogOpen = () => {
    setOpenReopenDialog(true);
  };

  const handleReopenDialogClose = () => {
    setOpenReopenDialog(false);
  };

  const handleEnableDialogOpen = () => {
    setOpenEnableDialog(true);
  };

  const handleEnableDialogClose = () => {
    setOpenEnableDialog(false);
  };

  const transitionsProps = {
    record,
    transitionType,
    setTransitionType,
    recordType,
    userPermissions,
    referDialog,
    transferDialog,
    assignDialog,
    handleReferClose: () => setReferDialog(false),
    handleTransferClose: () => setTransferDialog(false),
    handleAssignClose: () => setAssignDialog(false),
    pending: dialogPending,
    setPending: setDialogPending,
    currentPage,
    selectedRecords
  };

  const handleNotesClose = () => {
    setOpenNotesDialog(false);
  };

  const handleNotesOpen = () => {
    setOpenNotesDialog(true);
  };

  const handleRequestClose = () => {
    setRequestDialog(false);
  };

  const handleRequestOpen = () => {
    setApprovalType(REQUEST_TYPE);
    setRequestDialog(true);
  };

  const handleApprovalOpen = () => {
    setApprovalType(APPROVAL_TYPE);
    setApproveDialog(true);
  };

  const handleApprovalClose = () => {
    setApproveDialog(false);
  };

  const handleIncidentDialog = () => {
    setIncidentDialog(true);
  };

  const handleServiceDialog = () => {
    setServiceDialog(true);
  };

  const canOpenOrClose =
    (canReopen && openState === "reopen") ||
    (canClose && openState === "close");

  const formRecordType = i18n.t(
    `forms.record_types.${RECORD_TYPES[recordType]}`
  );

  const actions = [
    {
      name: `${i18n.t("buttons.referral")} ${formRecordType}`,
      action: () => {
        setTransitionType("referral");
        setReferDialog(true);
      },
      recordType,
      enabledFor: ENABLED_FOR_ONE_MANY,
      condition: canRefer,
      disableOffline: true
    },
    {
      name: `${i18n.t("buttons.reassign")} ${formRecordType}`,
      action: () => setAssignDialog(true),
      recordType,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE_MANY,
      condition: canAssign,
      disableOffline: true
    },
    {
      name: `${i18n.t("buttons.transfer")} ${formRecordType}`,
      action: () => setTransferDialog(true),
      recordType: ["cases", "incidents"],
      enabledFor: ENABLED_FOR_ONE_MANY,
      condition: canTransfer,
      disableOffline: true
    },
    {
      name: i18n.t("actions.incident_details_from_case"),
      action: handleIncidentDialog,
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE,
      condition: showListActions
        ? canAddIncident
        : canAddIncident && isSearchFromList,
      disableOffline: true,
      enabledOnSearch: true
    },
    {
      name: i18n.t("actions.services_section_from_case"),
      action: handleServiceDialog,
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE,
      condition: showListActions
        ? canAddService
        : canAddService && isSearchFromList,
      disableOffline: true,
      enabledOnSearch: true
    },
    {
      name: i18n.t(`actions.${openState}`),
      action: handleReopenDialogOpen,
      recordType: RECORD_TYPES.all,
      condition: mode && mode.isShow && canOpenOrClose
    },
    {
      name: i18n.t(`actions.${enableState}`),
      action: handleEnableDialogOpen,
      recordType: RECORD_TYPES.all,
      condition: mode && mode.isShow && canEnable
    },
    {
      name: i18n.t("actions.notes"),
      action: handleNotesOpen,
      recordType: RECORD_TYPES.all,
      condition: canAddNotes,
      disableOffline: true
    },
    {
      name: i18n.t("actions.request_approval"),
      action: handleRequestOpen,
      recordType: "all",
      condition: canRequest
    },
    {
      name: i18n.t("actions.approvals"),
      action: handleApprovalOpen,
      recordType: "all",
      condition: canApprove,
      disableOffline: true
    },
    {
      name: i18n.t(`${recordType}.export`),
      action: () => setOpenExportsDialog(true),
      recordType: RECORD_TYPES.all,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE_MANY_ALL,
      condition: canShowExports,
      disableOffline: true
    }
  ];

  const toggleEnableDialog = (
    <ToggleEnable
      close={handleEnableDialogClose}
      openEnableDialog={openEnableDialog}
      record={record}
      recordType={recordType}
    />
  );

  const toggleOpenDialog = (
    <ToggleOpen
      close={handleReopenDialogClose}
      openReopenDialog={openReopenDialog}
      record={record}
      recordType={recordType}
    />
  );

  const filterItems = items =>
    items.filter(item => {
      const actionCondition =
        typeof item.condition === "undefined" || item.condition;

      if (showListActions) {
        return item.recordListAction && actionCondition;
      }

      return (
        ([RECORD_TYPES.all, recordType].includes(item.recordType) ||
          (Array.isArray(item.recordType) &&
            item.recordType.includes(recordType))) &&
        actionCondition
      );
    });

  const filteredActions = filterItems(actions);
  const actionItems = filteredActions?.map(action => {
    const disabled =
      showListActions &&
      isDisabledAction(
        action.enabledFor,
        action.enabledOnSearch,
        isSearchFromList,
        selectedRecords,
        totalRecords
      );

    return (
      <ConditionalWrapper
        condition={action.disableOffline}
        wrapper={DisableOffline}
        button
        key={action.name}
      >
        <MenuItem
          selected={action.name === "Pyxis"}
          onClick={() => handleItemAction(action.action)}
          disabled={disabled}
        >
          {action.name}
        </MenuItem>
      </ConditionalWrapper>
    );
  });

  const requestsApproval = [
    {
      name: approvalsLabels.assessment,
      condition: canRequestBia,
      recordType: RECORD_TYPES.all,
      value: APPROVALS_TYPES.assessment
    },
    {
      name: approvalsLabels.case_plan,
      condition: canRequestCasePlan,
      recordType: RECORD_TYPES.all,
      value: APPROVALS_TYPES.case_plan
    },
    {
      name: approvalsLabels.closure,
      condition: canRequestClosure,
      recordType: RECORD_TYPES.all,
      value: APPROVALS_TYPES.closure
    }
  ];

  const approvals = [
    {
      name: approvalsLabels.assessment,
      condition: canApproveBia,
      recordType: RECORD_TYPES.all,
      value: APPROVALS_TYPES.assessment
    },
    {
      name: approvalsLabels.case_plan,
      condition: canApproveCasePlan,
      recordType: RECORD_TYPES.all,
      value: APPROVALS_TYPES.case_plan
    },
    {
      name: approvalsLabels.closure,
      condition: canApproveClosure,
      recordType: RECORD_TYPES.all,
      value: APPROVALS_TYPES.closure
    }
  ];

  const allowedRequestsApproval = filterItems(requestsApproval);
  const allowedApprovals = filterItems(approvals);
  const selectedRecordsOnCurrentPage =
    (selectedRecords &&
      Boolean(Object.keys(selectedRecords).length) &&
      selectedRecords[currentPage]) ||
    [];

  return (
    <>
      {mode && mode.isShow ? (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon color={iconColor} />
        </IconButton>
      ) : null}

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actionItems}
      </Menu>

      {canOpenOrClose ? toggleOpenDialog : null}

      <Permission resources={recordType} actions={ENABLE_DISABLE_RECORD}>
        {toggleEnableDialog}
      </Permission>

      <Transitions {...transitionsProps} />

      <Permission resources={recordType} actions={ADD_INCIDENT}>
        <AddIncident
          openIncidentDialog={incidentDialog}
          close={() => setIncidentDialog(false)}
          recordType={recordType}
          records={[]}
          selectedRowsIndex={selectedRecordsOnCurrentPage}
          pending={dialogPending}
          setPending={setDialogPending}
        />
      </Permission>

      <Permission resources={recordType} actions={ADD_SERVICE}>
        <AddService
          openServiceDialog={serviceDialog}
          close={() => setServiceDialog(false)}
          recordType={recordType}
          selectedRowsIndex={selectedRecordsOnCurrentPage}
          pending={dialogPending}
          setPending={setDialogPending}
        />
      </Permission>

      <Permission resources={recordType} actions={ADD_NOTE}>
        <Notes
          close={handleNotesClose}
          openNotesDialog={openNotesDialog}
          record={record}
          recordType={recordType}
        />
      </Permission>

      <Permission resources={recordType} actions={REQUEST_APPROVAL}>
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
      </Permission>

      <Permission resources={recordType} actions={APPROVAL}>
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
      </Permission>

      <Permission resources={recordType} actions={SHOW_EXPORTS}>
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
      </Permission>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  currentPage: PropTypes.number,
  iconColor: PropTypes.string,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  showListActions: PropTypes.bool
};

export default Container;
