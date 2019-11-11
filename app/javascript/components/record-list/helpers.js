import React from "react";
import { RECORD_PATH } from "config";

import { ToggleIconCell } from "./../index-table";
import {
  fetchCases,
  fetchIncidents,
  fetchTracingRequests,
  setCasesFilters,
  setIncidentsFilters,
  setTracingRequestFilters
} from "./../records";


export const buildTableColumns = (columns, i18n, recordType) => {
  const lastColumns = ["photo", "flags"];

  return columns
    .map(column => {
      const options = {
        ...{
          ...(["photos"].includes(column.get("name"))
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
        label: noLabelColumns.includes(column.name)
          ? ""
          : i18n.t(`${recordType}.${column.get("name")}`),
        name: column.get("field_name"),
        id: column.get("id_search"),
        options
      };
    })
    .sortBy(column => (lastColumns.includes(column.name) ? 1 : 0));
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
