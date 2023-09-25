import { FAMILY_DETAILS_SUBFORM_ID, RECORD_TYPES } from "../../../../config/constants";

export default (recordType, uniqueId) =>
  RECORD_TYPES[recordType] === RECORD_TYPES.cases && uniqueId === FAMILY_DETAILS_SUBFORM_ID;
