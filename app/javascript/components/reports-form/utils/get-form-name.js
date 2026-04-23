import { REPORTABLE_TYPES } from "../constants";

export default selectedRecordType =>
  /(\w*reportable\w*)$/.test(selectedRecordType) ? REPORTABLE_TYPES[selectedRecordType] : "";
