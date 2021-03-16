import { RECORD_TYPES, APPROVALS_TYPES } from "../../../config";

export default ({
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
    name: approvalsLabels.get(name),
    condition: ability,
    recordType: RECORD_TYPES.all,
    value: APPROVALS_TYPES[name]
  });

  return {
    approvals: [
      [APPROVALS_TYPES.assessment, canApproveBia],
      [APPROVALS_TYPES.case_plan, canApproveCasePlan],
      [APPROVALS_TYPES.closure, canApproveClosure],
      [APPROVALS_TYPES.action_plan, canApproveActionPlan],
      [APPROVALS_TYPES.gbv_closure, canApproveGbvClosure]
    ].map(mapFunction),
    requestsApproval: [
      [APPROVALS_TYPES.assessment, canRequestBia],
      [APPROVALS_TYPES.case_plan, canRequestCasePlan],
      [APPROVALS_TYPES.closure, canRequestClosure],
      [APPROVALS_TYPES.action_plan, canRequestActionPlan],
      [APPROVALS_TYPES.gbv_closure, canRequestGbvClosure]
    ].map(mapFunction)
  };
};
