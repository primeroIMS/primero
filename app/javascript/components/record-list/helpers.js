import React from "react";
import { Map } from "immutable";
import { DateCell, ToggleIconCell } from "components/index-table";
import sortBy from "lodash/sortBy";
import { pickBy } from "lodash";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

// TODO: Revist this when user endpoint if finished. Index fields will come
// this endpoint
export const buildTableColumns = (records, recordType, i18n) => {
  const css = makeStyles(styles)();
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
    const iconCell = [];
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

      if (["photos"].includes(k)) {
        column.options.customBodyRender = value => (
          <ToggleIconCell value={value} icon="photo" />
        );
        iconCell.push(column);
      }

      if (["flag_count"].includes(k)) {
        column.label = "";
        column.name = "flag_count";
        column.options.empty = true;
        column.options.customHeadRender = columnMeta => (
          <th key={columnMeta.name} className={css.overdueHeading} />
        );
        column.options.customBodyRender = value => (
          <ToggleIconCell value={value} icon="flag" />
        );
        iconCell.push(column);
      }

      return !["photos", "flag_count"].includes(k) && column;
    });

    const sortedRecords = sortBy(mappedRecords, i => i.id)
      .reverse()
      .filter(Boolean);
    return sortedRecords.concat(sortBy(iconCell, i => i.name).reverse());
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
