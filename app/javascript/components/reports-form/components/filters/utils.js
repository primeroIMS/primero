/* eslint-disable camelcase */

import { format } from "date-fns";

import { FILTERS_FIELD } from "../../constants";
import { DATE_FORMAT } from "../../../../config";
import { TICK_FIELD, SELECT_FIELD, RADIO_FIELD } from "../../../form";

export const registerValues = (index, data, currentValues, methods) => {
  Object.entries(data).forEach(entry => {
    const fieldName = `${FILTERS_FIELD}.${index}.${entry[0]}`;

    const rest = currentValues.filter(i => i.index.toString() !== index);

    if (!methods.control[fieldName]) {
      methods.register({ name: fieldName });
    }
    methods.setValue(fieldName, entry[1]);

    Object.entries(rest).forEach(restEl => {
      const { index: restElIndex, data: restElData } = restEl[1];
      const restFieldName = `${FILTERS_FIELD}.${restElIndex}.${entry[0]}`;

      if (!methods.control[restFieldName]) {
        methods.register({ name: restFieldName });
      }
      methods.setValue(restFieldName, restElData[entry[0]]);
    });
  });
};

export const formatValue = (value, i18n, { field, lookups }) => {
  if (value instanceof Date) {
    return format(value, DATE_FORMAT);
  }

  if (field && field.type === TICK_FIELD) {
    return value.includes("true")
      ? field?.tick_box_label || i18n.t("true")
      : i18n.t("report.not_selected");
  }

  if (
    field &&
    [SELECT_FIELD, RADIO_FIELD].includes(field.type) &&
    Array.isArray(value)
  ) {
    if (value.includes("not_null")) {
      return [];
    }

    if (field.option_strings_source) {
      const lookupValues = lookups.find(
        lookup => lookup.unique_id === field.option_strings_source
      )?.values;

      return value
        .map(currentValue => {
          const text = lookupValues.find(option => option.id === currentValue);

          return text.display_text[i18n.locale] || text.display_text;
        })
        .join(", ");
    }

    return value
      .map(
        currentValue =>
          field.option_strings_text[i18n.locale].find(
            option => option.id === currentValue
          ).display_text
      )
      .join(", ");
  }

  return value;
};
