import React from "react";

import { RECORD_PATH } from "../../config";

import { ToggleIconCell } from "../index-table";
import {
  fetchCases,
  fetchIncidents,
  fetchTracingRequests,
  setCasesFilters,
  setIncidentsFilters,
  setTracingRequestFilters
} from "../records";

export const buildTableColumns = (columns, i18n, recordType, css) => {
  const iconColumns = ["photo", "flag_count"];

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
            : {}),
          ...(["flag_count"].includes(column.get("name"))
            ? {
                customHeadRender: columnMeta => (
                  <th key={columnMeta.name} className={css.overdueHeading} />
                ),
                customBodyRender: value => (
                  <ToggleIconCell value={value} icon="flag" />
                )
            }
            : {})
        }
      };

      return {
        label: iconColumns.includes(column.get("name"))
          ? ""
          : i18n.t(`${recordType}.${column.get("name")}`),
        name: column.get("field_name"),
        id: column.get("id_search"),
        options
      };
    })
    .sortBy(column => (iconColumns.includes(column.name) ? 1 : 0));
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
