import { ACTIONS, ADD_INCIDENT, ADD_SERVICE, SHOW_EXPORTS, ASSIGN, REQUEST_APPROVAL, APPROVAL } from "../permissions";

export const APPROVAL_DIALOG = "approve";
export const APPROVAL_TYPE = "approval";
export const ASSIGN_DIALOG = "assign";
export const EXPORT_DIALOG = "export";
export const ENABLED_FOR_ONE = ["one"];
export const ENABLED_FOR_ONE_MANY = ["one", "many"];
export const ENABLED_FOR_ONE_MANY_ALL = ["one", "many", "all"];
export const REFER_DIALOG = "referral";
export const REQUEST_APPROVAL_DIALOG = "requestApproval";
export const REQUEST_TYPE = "request";
export const TRANSFER_DIALOG = "transfer";
export const SERVICE_DIALOG = "serviceDialog";
export const INCIDENT_DIALOG = "incidentDialog";

export const ABILITIES = {
  canAddNotes: [ACTIONS.MANAGE, ACTIONS.ADD_NOTE],
  canReopen: [ACTIONS.MANAGE, ACTIONS.REOPEN],
  canRefer: [ACTIONS.MANAGE, ACTIONS.REFERRAL],
  canClose: [ACTIONS.MANAGE, ACTIONS.CLOSE],
  canEnable: [ACTIONS.MANAGE, ACTIONS.ENABLE_DISABLE_RECORD],
  canAssign: ASSIGN,
  canTransfer: [ACTIONS.MANAGE, ACTIONS.TRANSFER],
  canRequest: REQUEST_APPROVAL,
  canRequestBia: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_ASSESSMENT],
  canRequestCasePlan: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_CASE_PLAN],
  canRequestClosure: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_CLOSURE],
  canRequestActionPlan: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_ACTION_PLAN],
  canRequestGbvClosure: [ACTIONS.MANAGE, ACTIONS.REQUEST_APPROVAL_GBV_CLOSURE],
  canApprove: APPROVAL,
  canApproveBia: [ACTIONS.MANAGE, ACTIONS.APPROVE_ASSESSMENT],
  canApproveCasePlan: [ACTIONS.MANAGE, ACTIONS.APPROVE_CASE_PLAN],
  canApproveClosure: [ACTIONS.MANAGE, ACTIONS.APPROVE_CLOSURE],
  canApproveActionPlan: [ACTIONS.MANAGE, ACTIONS.APPROVE_ACTION_PLAN],
  canApproveGbvClosure: [ACTIONS.MANAGE, ACTIONS.APPROVE_GBV_CLOSURE],
  canAddIncident: ADD_INCIDENT,
  canAddService: ADD_SERVICE,
  canShowExports: SHOW_EXPORTS
};
