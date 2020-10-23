import { RECORD_TYPES } from "../../../config";

export default ({ recordType, showListActions }) => item => {
  const actionCondition = typeof item.condition === "undefined" || item.condition;

  const allowedRecordType =
    [RECORD_TYPES.all, recordType].includes(item.recordType) ||
    (Array.isArray(item.recordType) && item.recordType.includes(recordType));

  if (showListActions && allowedRecordType) {
    return item.recordListAction && actionCondition;
  }

  return allowedRecordType && actionCondition;
};
