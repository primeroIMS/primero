import React from "react";
import { Map } from "immutable";
import { ToggleIconCell } from "components/index-table";
import { pickBy } from "lodash";

// TODO: Revist this when user endpoint if finished. Index fields will come
// this endpoint
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

export const cleanUpFilters = filters => {
  const filtersArray = pickBy(filters, value => {
    const isMap = Map.isMap(value);
    return !(
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      ((isMap || typeof value === "object") &&
        Object.values(isMap ? value.toJS() : value).includes(null))
    );
  });

  Object.entries(filtersArray).forEach(filter => {
    const [key, value] = filter;
    if (Array.isArray(value)) {
      filtersArray[key] = value.join(",");
    } else if (
      typeof value === "object" &&
      !Object.values(value.toJS()).includes(null)
    ) {
      const valueConverted = {};
      Object.entries(value.toJS()).forEach(keys => {
        const [k, v] = keys;
        valueConverted[k] = v;
      });
      filtersArray[key] = valueConverted;
    } else {
      filtersArray[key] = value;
    }
  });
  return filtersArray;
};
