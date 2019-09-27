import React from "react";
import { ToggleIconCell } from "components/index-table";

export const buildTableColumns = (columns, i18n, recordType) => {
  const lastColumns = ["photo", "flags"];

  return columns
    .map(c => {
      const options = {
        ...{
          ...(["photos"].includes(c.name)
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
          : i18n.t(`${recordType}.${c.name}`),
        name: c.field_name,
        id: c.id_search,
        options
      };
    })
    .sortBy(i => (lastColumns.includes(i.name) ? 1 : 0));
};
