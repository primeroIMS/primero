// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import last from "lodash/last";

import { REPORTING_LOCATION_INSIGHTS } from "../constants";

const getReportingLocationValue = reportingLocationValue => {
  if (isEmpty(reportingLocationValue)) {
    return reportingLocationValue;
  }

  return last(reportingLocationValue.split(":"));
};

export default (lookups, indicatorsRows, translateId, key, value, property = "id", totalText) => {
  const valueKeyLookups = lookups[key];
  const indicatorRows = indicatorsRows[key];

  if (isEmpty(valueKeyLookups) && isEmpty(indicatorRows)) {
    return translateId(value.get(property));
  }

  if (!isEmpty(indicatorRows)) {
    const row = indicatorRows.find(elem => elem.id === value.get(property));

    if (row) {
      return row.display_text;
    }
  }

  if (value.get("id") === "total") {
    return totalText;
  }

  const translatedValue =
    valueKeyLookups.find(lookup => lookup.id === value.get("id"))?.display_text || translateId(value.get("id"));

  if (REPORTING_LOCATION_INSIGHTS.includes(key)) {
    return getReportingLocationValue(translatedValue);
  }

  return translatedValue;
};
