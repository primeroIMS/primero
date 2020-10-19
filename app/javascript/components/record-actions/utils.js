/* eslint-disable import/prefer-default-export */
import { RECORD_TYPES, APPROVALS_TYPES, RECORD_PATH } from "../../config";
import { fetchIncidentFromCase } from "../records";

import {
  ALL,
  MANY,
  ONE,
  ENABLED_FOR_ONE_MANY,
  ENABLED_FOR_ONE,
  ENABLED_FOR_ONE_MANY_ALL,
  REQUEST_APPROVAL_DIALOG,
  APPROVAL_DIALOG,
  APPROVAL_TYPE,
  REQUEST_TYPE,
  REFER_DIALOG,
  TRANSFER_DIALOG,
  ASSIGN_DIALOG,
  EXPORT_DIALOG,
  SERVICE_DIALOG,
  INCIDENT_DIALOG
} from "./constants";

const filterActions = ({ recordType, showListActions }) => item => {
  const actionCondition = typeof item.condition === "undefined" || item.condition;

  const allowedRecordType =
    [RECORD_TYPES.all, recordType].includes(item.recordType) ||
    (Array.isArray(item.recordType) && item.recordType.includes(recordType));

  if (showListActions && allowedRecordType) {
    return item.recordListAction && actionCondition;
  }

  return allowedRecordType && actionCondition;
};

export const buildApprovalList = ({
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
}) => {
  const mapFunction = ([name, ability]) => ({
    name: approvalsLabels[name],
    condition: ability,
    recordType: RECORD_TYPES.all,
    value: APPROVALS_TYPES[name]
  });

  return {
    approvals: [
      ["assessment", canApproveBia],
      ["case_plan", canApproveCasePlan],
      ["closure", canApproveClosure],
      ["action_plan", canApproveActionPlan],
      ["gbv_closure", canApproveGbvClosure]
    ].map(mapFunction),
    requestsApproval: [
      ["assessment", canRequestBia],
      ["case_plan", canRequestCasePlan],
      ["closure", canRequestClosure],
      ["action_plan", canRequestActionPlan],
      ["gbv_closure", canRequestGbvClosure]
    ].map(mapFunction)
  };
};

export const isDisabledAction = (enabledFor, enabledOnSearch, isSearchFromList, selectedRecords, totaRecords) => {
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat().length;
  const forOne = enabledFor?.includes(ONE);
  const forMany = enabledFor?.includes(MANY);
  const forAll = enabledFor?.includes(ALL);

  const enableForOne = enabledOnSearch
    ? selectedRecordsLength === 1 && forOne && enabledOnSearch && isSearchFromList
    : selectedRecordsLength === 1 && forOne;
  const enableForMany = selectedRecordsLength > 1 && selectedRecordsLength !== totaRecords && forMany;
  const enableForAll = selectedRecordsLength === totaRecords && forAll;

  return !(selectedRecordsLength > 0 && (enableForOne || enableForMany || enableForAll));
};

export const buildActionList = ({
  i18n,
  dispatch,
  record,
  openState,
  enableState,
  handleDialogClick,
  isShow,
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
}) => {
  const formRecordType = i18n.t(`forms.record_types.${RECORD_TYPES[recordType]}`);

  return [
    {
      name: `${i18n.t("buttons.referral")} ${formRecordType}`,
      action: open => handleDialogClick(REFER_DIALOG, open),
      // action: () => {
      //   setTransitionType("referral");
      //   setReferDialog(true);
      // },
      recordType: RECORD_PATH.cases,
      enabledFor: ENABLED_FOR_ONE_MANY,
      condition: canRefer,
      disableOffline: true
    },
    {
      name: `${i18n.t("buttons.reassign")} ${formRecordType}`,
      action: open => handleDialogClick(ASSIGN_DIALOG, open),
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE_MANY,
      condition: canAssign,
      disableOffline: true
    },
    {
      name: `${i18n.t("buttons.transfer")} ${formRecordType}`,
      action: open => handleDialogClick(TRANSFER_DIALOG, open),
      recordType: RECORD_PATH.cases,
      enabledFor: ENABLED_FOR_ONE_MANY,
      condition: canTransfer,
      disableOffline: true
    },
    {
      name: i18n.t("actions.incident_details_from_case"),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE,
      condition: hasIncidentSubform && (showListActions ? canAddIncident : canAddIncident && isIdSearch),
      disableOffline: true,
      enabledOnSearch: true
    },
    {
      name: i18n.t("actions.incident_from_case"),
      action: () => {
        dispatch(fetchIncidentFromCase(record.get("id"), record.get("module_id")));
      },
      recordType: RECORD_PATH.cases,
      recordListAction: false,
      enabledFor: ENABLED_FOR_ONE,
      condition: canCreateIncident,
      disableOffline: true,
      enabledOnSearch: false
    },
    {
      name: i18n.t("actions.services_section_from_case"),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      // action: handleDialogClick,
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE,
      condition: hasServiceSubform && (showListActions ? canAddService : canAddService && isIdSearch),
      disableOffline: true,
      enabledOnSearch: true
    },
    {
      name: i18n.t(`actions.${openState}`),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      // action: handleReopenDialogOpen,
      recordType: RECORD_PATH.cases,
      condition: isShow && canOpenOrClose
    },
    {
      name: i18n.t(`actions.${enableState}`),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      // action: handleEnableDialogOpen,
      recordType: RECORD_PATH.cases,
      condition: isShow && canEnable
    },
    {
      name: i18n.t("actions.notes"),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      // action: handleNotesOpen,
      recordType: RECORD_PATH.cases,
      condition: canAddNotes,
      disableOffline: true
    },
    {
      name: i18n.t("actions.request_approval"),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      // action: handleRequestOpen,
      recordType: RECORD_PATH.cases,
      condition: canRequest
    },
    {
      name: i18n.t("actions.approvals"),
      action: open => handleDialogClick(INCIDENT_DIALOG, open),
      // action: handleApprovalOpen,
      recordType: RECORD_PATH.cases,
      condition: canApprove,
      disableOffline: true
    },
    {
      id: EXPORT_DIALOG,
      name: i18n.t(`${recordType}.export`),
      action: id => {
        handleDialogClick(id, true);
      },
      recordType: RECORD_TYPES.all,
      recordListAction: true,
      enabledFor: ENABLED_FOR_ONE_MANY_ALL,
      condition: canShowExports,
      disableOffline: true
    }
  ].filter(filterActions({ recordType, showListActions }));
};

export const subformExists = (parentForm, subformName) =>
  // eslint-disable-next-line camelcase
  parentForm && parentForm.fields.find(field => field.name === subformName)?.subform_section_id;
