import React from "react";
import { format, parseISO } from "date-fns";
import TableCell from "@material-ui/core/TableCell";

import Lightbox from "../lightbox";
import { ToggleIconCell } from "../index-table";
import { RECORD_PATH } from "../../config";

import { ALERTS_COLUMNS, ALERTS } from "./constants";

export const buildTableColumns = (allowedColumns, i18n, recordType, css) => {
  const iconColumns = Object.values(ALERTS_COLUMNS);

  const emptyHeader = name => <th key={name} className={css.overdueHeading} />;

  const columns = allowedColumns
    .filter(
      column =>
        ![ALERTS_COLUMNS.flag_count, ALERTS_COLUMNS.alert_count].includes(
          column.get("name")
        )
    )
    .map(column => {
      const options = {
        ...{
          ...([ALERTS_COLUMNS.photo].includes(column.get("name"))
            ? {
                // eslint-disable-next-line react/no-multi-comp
                customHeadRender: (columnMeta, handleToggleColumn) => {
                  return (
                    <TableCell
                      key={columnMeta.index}
                      className={css.photoHeader}
                      onClick={() => handleToggleColumn(columnMeta.index)}
                    >
                      {columnMeta.name}
                    </TableCell>
                  );
                },
                // eslint-disable-next-line react/no-multi-comp
                customBodyRender: value => (
                  <div className={css.photoIcon}>
                    <Lightbox
                      trigger={
                        <ToggleIconCell
                          value={Boolean(value)}
                          icon={ALERTS_COLUMNS.photo}
                        />
                      }
                      image={value}
                    />
                  </div>
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

  const canShowAlertIcon = allowedColumns
    .map(allowedColumn => allowedColumn.name)
    .includes(ALERTS_COLUMNS.alert_count);
  const canShowFlagIcon = allowedColumns
    .map(allowedColumn => allowedColumn.name)
    .includes(ALERTS_COLUMNS.flag_count);

  const columsWithAlerts = columns.push({
    label: "",
    name: ALERTS,
    id: false,
    sort: false,
    options: {
      customHeadRender: columnMeta => emptyHeader(columnMeta),
      // eslint-disable-next-line react/no-multi-comp
      customBodyRender: value => {
        const alertIcon =
          canShowAlertIcon && value?.alert_count > 0 ? (
            <ToggleIconCell
              value={value.alert_count}
              icon={ALERTS_COLUMNS.alert_count}
            />
          ) : null;

        const flagIcon =
          canShowFlagIcon && value?.flag_count > 0 ? (
            <ToggleIconCell
              value={value.flag_count}
              icon={ALERTS_COLUMNS.flag_count}
            />
          ) : null;

        return (
          <div className={css.alerts}>
            {alertIcon}
            {flagIcon}
          </div>
        );
      }
    }
  });

  return [
    RECORD_PATH.cases,
    RECORD_PATH.incidents,
    RECORD_PATH.tracing_requests
  ].includes(recordType)
    ? columsWithAlerts
    : columns;
};
