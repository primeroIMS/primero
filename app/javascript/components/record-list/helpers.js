import React from "react";
import { dataToJS } from "libs";
import { DateCell, ToggleIconCell } from "components/index-table";
import sortBy from "lodash/sortBy";
import { pickBy } from "lodash";
import { Link } from "react-router-dom";

export const buildTableColumns = (records, recordType, i18n, path) => {
  const record =
    records && records.size > 0
      ? Object.keys(dataToJS(records.get(0))).filter(i => i !== "id")
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

      if (idFields.includes(k)) {
        column.options.customBodyRender = (value, meta) => {
          return (
            <Link to={`/${path}/${records.getIn([meta.rowIndex, "id"])}`}>
              {value}
            </Link>
          );
        };
      }

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

      if (["flags"].includes(k)) {
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
    return !(
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  Object.entries(filtersArray).forEach(filter => {
    const [key, value] = filter;
    if (Array.isArray(value)) {
      filtersArray[key] = value.join(",");
    } else if (typeof value === "object") {
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
