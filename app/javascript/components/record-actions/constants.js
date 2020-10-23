import {
  ACTIONS,
  ADD_INCIDENT,
  CREATE_INCIDENT,
  ADD_SERVICE,
  SHOW_EXPORTS,
  ASSIGN,
  REQUEST_APPROVAL,
  APPROVAL
} from "../permissions";

export const ID_SEARCH = "id_search";

export const APPROVAL_DIALOG = "approve";
export const APPROVAL_TYPE = "approval";
export const ASSIGN_DIALOG = "assign";
export const EXPORT_DIALOG = "export";
export const REFER_DIALOG = "referral";
export const REQUEST_APPROVAL_DIALOG = "requestApproval";
export const REQUEST_TYPE = "request";
export const TRANSFER_DIALOG = "transfer";
export const SERVICE_DIALOG = "serviceDialog";
export const INCIDENT_DIALOG = "incidentDialog";
export const NOTES_DIALOG = "notes";
export const ENABLE_DISABLE_DIALOG = "enableDisable";
export const OPEN_CLOSE_DIALOG = "openClose";

export const ONE = "one";
export const MANY = "many";
export const ALL = "all";

export const ENABLED_FOR_ONE = [ONE];
export const ENABLED_FOR_ONE_MANY = [ONE, MANY];
export const ENABLED_FOR_ONE_MANY_ALL = [ONE, MANY, ALL];

export const RECORD_ACTION_ABILITIES = {
  canAddIncident: ADD_INCIDENT,
  canAddNotes: [ACTIONS.MANAGE, ACTIONS.ADD_NOTE],
  canAddService: ADD_SERVICE,
  canApprove: APPROVAL,
  canApproveActionPlan: [ACTIONS.MANAGE, ACTIONS.APPROVE_ACTION_PLAN],
  canApproveBia: [ACTIONS.MANAGE, ACTIONS.APPROVE_ASSESSMENT],
  canApproveCasePlan: [ACTIONS.MANAGE, ACTIONS.APPROVE_CASE_PLAN],
  canApproveClosure: [ACTIONS.MANAGE, ACTIONS.APPROVE_CLOSURE],
  canApproveGbvClosure: [ACTIONS.MANAGE, ACTIONS.APPROVE_GBV_CLOSURE],
  canAssign: ASSIGN,
  canCreateIncident: CREATE_INCIDENT,
  canClose: [ACTIONS.MANAGE, ACTIONS.CLOSE],
  canEnable: [ACTIONS.MANAGE, ACTIONS.ENABLE_DISABLE_RECORD],
  canOnlyExportPdf: [ACTIONS.EXPORT_PDF],
  canRefer: [ACTIONS.MANAGE, ACTIONS.REFERRAL],
  canReopen: [ACTIONS.MANAGE, ACTIONS.REOPEN],
  canRequest: REQUEST_APPROVAL,
  canRequestActionPlan: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_ACTION_PLAN],
  canRequestBia: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_ASSESSMENT],
  canRequestCasePlan: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_CASE_PLAN],
  canRequestClosure: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_CLOSURE],
  canRequestGbvClosure: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_GBV_CLOSURE],
  canShowExports: SHOW_EXPORTS,
  canTransfer: [ACTIONS.MANAGE, ACTIONS.TRANSFER]
};
