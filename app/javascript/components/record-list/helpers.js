import React from "react";
import { ToggleIconCell } from "components/index-table";
import {
  fetchCases,
  fetchIncidents,
  fetchTracingRequests,
  setCasesFilters,
  setIncidentsFilters,
  setTracingRequestFilters
} from "components/records";

import { RECORD_PATH } from "config";

export const buildTableColumns = (columns, i18n, recordType) => {
  const lastColumns = ["photo", "flags"];
  return columns
    .map(c => {
      const options = {
        ...{
          ...(["photos"].includes(c.get("name"))
            ? {
                customBodyRender: value => (
                  <ToggleIconCell value={value} icon="photo" />
                )
              }
            : {})
        }
      };

      const noLabelColumns = ["photo"];

      return {
        label: noLabelColumns.includes(c.name)
          ? ""
          : i18n.t(`${recordType}.${c.get("name")}`),
        name: c.get("field_name"),
        id: c.get("id_search"),
        options
      };
    })
    .sortBy(i => (lastColumns.includes(i.name) ? 1 : 0));
};

export const getFiltersSetterByType = type => {
  switch (type) {
    case RECORD_PATH.incidents:
      return setIncidentsFilters;
    case RECORD_PATH.tracing_requests:
      return setTracingRequestFilters;
    default:
      return setCasesFilters;
  }
};

export const getRecordsFetcherByType = type => {
  switch (type) {
    case RECORD_PATH.incidents:
      return fetchIncidents;
    case RECORD_PATH.tracing_requests:
      return fetchTracingRequests;
    default:
      return fetchCases;
  }
};
