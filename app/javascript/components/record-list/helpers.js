import React from "react";
import { dataToJS } from "libs";
import isEmpty from "lodash/isEmpty";
import { DateCell, ToggleIconCell } from "components/index-table";

export const buildTableColumns = (records, recordType, i18n) => {
  const record = !isEmpty(records)
    ? Object.keys(dataToJS(records.get(0)))
    : null;

  if (record) {
    record.push(...["photo_keys", "flags"]);

    return record.map(k => {
      const column = {
        label: i18n.t(`${recordType}.${k}`),
        name: k,
        id: ["id", "short_id"].includes(k),
        options: {}
      };

      if (
        ["inquiry_date", "registration_date", "case_opening_date"].includes(k)
      ) {
        column.options.customBodyRender = value => <DateCell value={value} />;
      }

      if (["flags"].includes(k)) {
        column.options.customBodyRender = value => (
          <ToggleIconCell value={value} icon="flag" />
        );
      }

      if (["photo_keys"].includes(k)) {
        column.options.customBodyRender = value => (
          <ToggleIconCell value={value} icon="photo" />
        );
      }

      return column;
    });
  }

  return [];
};
