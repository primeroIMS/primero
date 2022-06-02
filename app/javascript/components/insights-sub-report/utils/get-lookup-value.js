import isEmpty from "lodash/isEmpty";
import last from "lodash/last";

const getReportingLocationValue = reportingLocationValue => {
  if (isEmpty(reportingLocationValue)) {
    return reportingLocationValue;
  }

  return last(reportingLocationValue.split(":"));
};

export default (lookups, translateId, key, value) => {
  const valueKeyLookups = lookups[key];

  if (isEmpty(valueKeyLookups)) {
    return translateId(value.get("id"));
  }

  const translatedValue =
    valueKeyLookups.find(lookup => lookup.id === value.get("id"))?.display_text || translateId(value.get("id"));

  if (key === "reporting_location") {
    return getReportingLocationValue(translatedValue);
  }

  return translatedValue;
};
