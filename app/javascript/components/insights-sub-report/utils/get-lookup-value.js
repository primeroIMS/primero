import isEmpty from "lodash/isEmpty";
import last from "lodash/last";

import { REPORTING_LOCATION_INSIGHTS } from "../constants";

const getReportingLocationValue = reportingLocationValue => {
  if (isEmpty(reportingLocationValue)) {
    return reportingLocationValue;
  }

  return last(reportingLocationValue.split(":"));
};

export default (lookups, translateId, key, value, property = "id") => {
  const valueKeyLookups = lookups[key];

  if (isEmpty(valueKeyLookups)) {
    return translateId(value.get(property));
  }

  const translatedValue =
    valueKeyLookups.find(lookup => lookup.id === value.get("id"))?.display_text || translateId(value.get("id"));

  if (REPORTING_LOCATION_INSIGHTS.includes(key)) {
    return getReportingLocationValue(translatedValue);
  }

  return translatedValue;
};
