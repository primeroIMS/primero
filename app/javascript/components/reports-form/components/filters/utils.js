// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */
import { format } from "date-fns";
import isEmpty from "lodash/isEmpty";

import { FILTERS_FIELD, NOT_NULL } from "../../constants";
import { DATE_FORMAT } from "../../../../config";
import { displayNameHelper } from "../../../../libs";
import { NUMERIC_FIELD, RADIO_FIELD, DATE_FIELD, TICK_FIELD, SELECT_FIELD } from "../../../form";

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
    return Array.isArray(value) && (value.includes(true) || value.includes("true"))
      ? displayNameHelper(field?.tick_box_label, i18n.locale) || i18n.t("true")
      : i18n.t("report.not_selected");
  }

  if (field && [SELECT_FIELD, RADIO_FIELD].includes(field.type) && Array.isArray(value)) {
    if (value.includes(NOT_NULL)) {
      return [];
    }

    if (field.option_strings_source) {
      const lookupValues = lookups.find(
        lookup => lookup.unique_id === field.option_strings_source.replace(/lookup /, "")
      )?.values;

      return value
        .map(currentValue => {
          const text = lookupValues.find(option => option.id === currentValue);

          return typeof text.display_text === "object"
            ? displayNameHelper(text.display_text, i18n.locale)
            : text.display_text;
        })
        .join(", ");
    }

    return value
      .map(
        currentValue => field.option_strings_text?.find(option => option.id === currentValue).display_text[i18n.locale]
      )
      .join(", ");
  }

  return value;
};

export const onFilterDialogSuccess =
  ({ indexes, i18n, parentFormMethods, setIndexes }) =>
  (index, currentReportFilter, currentField) => {
    const data =
      currentField.type === DATE_FIELD && Array.isArray(currentReportFilter.value) && isEmpty(currentReportFilter.value)
        ? { ...currentReportFilter, value: formatValue(new Date(), i18n, {}) }
        : currentReportFilter;

    if ([DATE_FIELD, NUMERIC_FIELD].includes(currentField.type) && currentReportFilter.constraint === NOT_NULL) {
      data.value = "";
    }

    if (
      [SELECT_FIELD, RADIO_FIELD].includes(currentField.type) &&
      typeof currentReportFilter.constraint === "boolean" &&
      currentReportFilter.constraint
    ) {
      data.constraint = false;
      data.value = [NOT_NULL];
    }

    if (Object.is(index, null)) {
      setIndexes([...indexes, { index: indexes.length, data }]);
      registerValues(indexes.length, data, indexes, parentFormMethods);
    } else {
      const indexesCopy = [...indexes].slice();

      indexesCopy[index] = { ...indexesCopy[index], data };

      setIndexes(indexesCopy);
      registerValues(index, data, indexes, parentFormMethods);
    }
  };
