import { RECORD_TYPES, APPROVALS_TYPES } from "../../config";

export const isDisabledAction = (enabledFor, enabledOnSearch, isSearchFromList, selectedRecords, totaRecords) => {
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat().length;
  const forOne = enabledFor?.includes("one");
  const forMany = enabledFor?.includes("many");
  const forAll = enabledFor?.includes("all");

  const enableForOne = enabledOnSearch
    ? selectedRecordsLength === 1 && forOne && enabledOnSearch && isSearchFromList
    : selectedRecordsLength === 1 && forOne;
  const enableForMany = selectedRecordsLength > 1 && selectedRecordsLength !== totaRecords && forMany;
  const enableForAll = selectedRecordsLength === totaRecords && forAll;

  return !(selectedRecordsLength > 0 && (enableForOne || enableForMany || enableForAll));
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
