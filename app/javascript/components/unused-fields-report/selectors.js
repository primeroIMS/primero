/* eslint-disable import/prefer-default-export */
import namespace from "./namespace";

export const getUnusedFieldsReportUrl = state => state.getIn(["records", namespace, "data", "unused_fields_report"]);
