import React from "react";
import { Map } from "immutable";
import { DateCell, ToggleIconCell } from "components/index-table";
import sortBy from "lodash/sortBy";
import { pickBy } from "lodash";

// TODO: Revist this when user endpoint if finished. Index fields will come
// this endpoint
export const buildTableColumns = (records, recordType, i18n) => {
  const record =
    records && records.size > 0
      ? records
          .map(k => k.keySeq().toArray())
          .toJS()
          .flat()
          .filter((v, i, a) => a.indexOf(v) === i)
          .filter(i => i !== "id")
      : false;

  if (record) {
    const mappedRecords = record.map(k => {
      const idFields = ["short_id", "case_id_display"];

      const isIdField = idFields.includes(k);

      const column = {
        label: i18n.t(isIdField ? `${recordType}.label` : `${recordType}.${k}`),
        name: k,
        id: isIdField,
        options: {}
      };

      if (
        [
          "inquiry_date",
          "registration_date",
          "case_opening_date",
          "created_at"
        ].includes(k)
      ) {
        column.options.customBodyRender = value => <DateCell value={value} />;
      }

      if (["flag_count"].includes(k)) {
        column.options.label = "";
        column.options.empty = true;
        column.options.customBodyRender = value => (
          <ToggleIconCell value={value} icon="flag" />
        );
      }

      if (["photos"].includes(k)) {
        column.options.customBodyRender = value => (
          <ToggleIconCell value={value} icon="photo" />
        );
      }

      return column;
    });

    return sortBy(mappedRecords, i => i.id).reverse();
  }

  return [];
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
      !Object.values(value).includes(null)
    ) {
      const valueConverted = {};
      Object.entries(value).forEach(keys => {
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
