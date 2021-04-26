import {
  ENABLED_FOR_ONE_MANY,
  ENABLED_FOR_ONE,
  ENABLED_FOR_ONE_MANY_ALL,
  REQUEST_APPROVAL_DIALOG,
  APPROVAL_DIALOG,
  REFER_DIALOG,
  TRANSFER_DIALOG,
  ASSIGN_DIALOG,
  EXPORT_DIALOG,
  SERVICE_DIALOG,
  INCIDENT_DIALOG,
  NOTES_DIALOG,
  OPEN_CLOSE_DIALOG,
  ENABLE_DISABLE_DIALOG,
  APPROVAL_TYPE,
  REQUEST_TYPE
} from "../constants";
import { RECORD_TYPES, RECORD_PATH } from "../../../config";
import Notes from "../notes";
import ToggleEnable from "../toggle-enable";
import ToggleOpen from "../toggle-open";
import Transitions from "../transitions";
import AddIncident from "../add-incident";
import AddService from "../add-service";
import RequestApproval from "../request-approval";
import Exports from "../exports";

import filterActions from "./filter-actions";

export default ({
  approvals,
  canAddIncident,
  canAddNotes,
  canAddService,
  canApprove,
  canAssign,
  canCreateIncident,
  canEnable,
  canOnlyExportPdf,
  canOpenOrClose,
  canRefer,
  canRequest,
  canShowExports,
  canTransfer,
  enableState,
  handleDialogClick,
  hasIncidentSubform,
  hasServiceSubform,
  i18n,
  isIdSearch,
  isShow,
  openState,
  record,
  recordType,
  requestsApproval,
  showListActions,
  handleCreateIncident
}) => {
  const formRecordType = i18n.t(`forms.record_types.${RECORD_TYPES[recordType]}`);

  return {
    actions: [
      {
        action: () => handleDialogClick(REFER_DIALOG),
        condition: canRefer,
        disableOffline: true,
        enabledFor: ENABLED_FOR_ONE_MANY,
        name: `${i18n.t("buttons.referral")} ${formRecordType}`,
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(ASSIGN_DIALOG),
        condition: canAssign,
        disableOffline: true,
        enabledFor: ENABLED_FOR_ONE_MANY,
        name: `${i18n.t("buttons.reassign")} ${formRecordType}`,
        recordListAction: true,
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(TRANSFER_DIALOG),
        condition: canTransfer,
        disableOffline: true,
        enabledFor: ENABLED_FOR_ONE_MANY,
        name: `${i18n.t("buttons.transfer")} ${formRecordType}`,
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(INCIDENT_DIALOG),
        condition: Boolean(hasIncidentSubform) && showListActions && canAddIncident,
        disableOffline: true,
        enabledFor: ENABLED_FOR_ONE,
        name: i18n.t("actions.incident_details_from_case"),
        recordListAction: true,
        recordType: RECORD_PATH.cases,
        showOnSearchResultPage: true,
        disableRecordShowPage: true
      },
      {
        action: () => {
          handleCreateIncident();
        },
        condition: canCreateIncident,
        disableOffline: false,
        enabledFor: ENABLED_FOR_ONE,
        enabledOnSearch: false,
        name: i18n.t("actions.incident_from_case"),
        recordListAction: false,
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(SERVICE_DIALOG),
        condition: Boolean(hasServiceSubform) && showListActions && canAddService,
        disableOffline: true,
        enabledFor: ENABLED_FOR_ONE,
        name: i18n.t("actions.services_section_from_case"),
        recordListAction: true,
        recordType: RECORD_PATH.cases,
        showOnSearchResultPage: true,
        disableRecordShowPage: true
      },
      {
        action: () => handleDialogClick(OPEN_CLOSE_DIALOG),
        condition: isShow && canOpenOrClose,
        name: i18n.t(`actions.${openState}`),
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(ENABLE_DISABLE_DIALOG),
        condition: isShow && canEnable,
        name: i18n.t(`actions.${enableState}`),
        recordType: RECORD_TYPES.all
      },
      {
        action: () => handleDialogClick(NOTES_DIALOG),
        condition: canAddNotes,
        disableOffline: true,
        name: i18n.t("actions.notes"),
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(REQUEST_APPROVAL_DIALOG),
        condition: canRequest,
        name: i18n.t("actions.request_approval"),
        recordType: RECORD_PATH.cases
      },
      {
        action: () => handleDialogClick(APPROVAL_DIALOG),
        condition: canApprove,
        disableOffline: true,
        name: i18n.t("actions.approvals"),
        recordType: RECORD_PATH.cases
      },
      {
        action: id => {
          handleDialogClick(id, true);
        },
        condition: showListActions ? canShowExports : canShowExports || canOnlyExportPdf,
        disableOffline: true,
        enabledFor: ENABLED_FOR_ONE_MANY_ALL,
        id: EXPORT_DIALOG,
        name: i18n.t(`${recordType}.export`),
        recordListAction: true,
        recordType: RECORD_TYPES.all
      }
    ].filter(filterActions({ recordType, showListActions, isIdSearch, record })),
    dialogs: {
      [REFER_DIALOG]: {
        component: Transitions,
        ability: true
      },
      [ASSIGN_DIALOG]: {
        component: Transitions,
        ability: true
      },
      [TRANSFER_DIALOG]: {
        component: Transitions,
        ability: true
      },
      [OPEN_CLOSE_DIALOG]: {
        component: ToggleOpen,
        ability: canOpenOrClose
      },
      [ENABLE_DISABLE_DIALOG]: {
        component: ToggleEnable,
        ability: canEnable
      },
      [INCIDENT_DIALOG]: {
        component: AddIncident,
        ability: canAddIncident
      },
      [SERVICE_DIALOG]: {
        component: AddService,
        ability: canAddService
      },
      [NOTES_DIALOG]: {
        component: Notes,
        ability: canAddNotes
      },
      [REQUEST_APPROVAL_DIALOG]: {
        component: RequestApproval,
        ability: canRequest,
        props: {
          subMenuItems: requestsApproval.filter(filterActions({ recordType, showListActions })),
          confirmButtonLabel: i18n.t("buttons.ok"),
          approvalType: REQUEST_TYPE
        }
      },
      [APPROVAL_DIALOG]: {
        component: RequestApproval,
        ability: canApprove,
        props: {
          subMenuItems: approvals.filter(filterActions({ recordType, showListActions })),
          confirmButtonLabel: i18n.t("buttons.submit"),
          approvalType: APPROVAL_TYPE
        }
      },
      [EXPORT_DIALOG]: {
        component: Exports,
        ability: canShowExports || canOnlyExportPdf
      }
    }
  };
};
