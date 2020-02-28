import React from "react";
import { Button } from "@material-ui/core";
import { format, parseISO } from "date-fns";

import Lightbox from "../lightbox";
import { ToggleIconCell } from "../index-table";

export const buildTableColumns = (columns, i18n, recordType, css) => {
  const iconColumns = ["photo", "alert_count"];

  const emptyHeader = name => <th key={name} className={css.overdueHeading} />;

  return columns
    .map(column => {
      const options = {
        ...{
          ...(["photo"].includes(column.get("name"))
            ? {
                customBodyRender: value => (
                  <Lightbox
                    trigger={
                      <ToggleIconCell value={Boolean(value)} icon="photo" />
                    }
                    image={value}
                  />
                )
              }
            : {}),
          ...(column.get("name") === "registration_date"
            ? {
                customBodyRender: value =>
                  format(parseISO(value), "dd-MMM-yyyy")
              }
            : {}),
          ...(column.get("name") === "case_opening_date"
            ? {
                customBodyRender: value =>
                  format(parseISO(value), "dd-MMM-yyyy HH:mm")
              }
            : {}),
          ...(["alert_count", "flag_count"].includes(column.get("name"))
            ? {
                customHeadRender: columnMeta => emptyHeader(columnMeta),
                customBodyRender: value => (
                  <ToggleIconCell value={value} icon={column.get("name")} />
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
