// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */
import { displayNameHelper, valueFromOptionSource } from "../../../libs";
import { FIELDS } from "../../record-owner/constants";
import { APPROVALS, INCIDENTS } from "../constants";

const getFieldValueFromOptionText = (i18n, selectedFieldOptionsText, fieldValue) => {
  const valueTranslated = value =>
    displayNameHelper(
      selectedFieldOptionsText?.find(
        optionStringText => optionStringText.id === value
        // eslint-disable-next-line camelcase
      )?.display_text,
      i18n.locale
    );

  if (Array.isArray(fieldValue)) {
    return fieldValue.map(value => valueTranslated(value));
  }

  return valueTranslated(fieldValue);
};

export const filterFieldsRecordInformation = field =>
  FIELDS.filter(fieldInformation => fieldInformation.name === field);

export default (allAgencies, allLookups, locations, i18n, selectedField, field, value) => {
  let fieldDisplayName;
  let fieldValueFrom = value.from;
  let fieldValueTo = value.to;

  if (field === APPROVALS) {
    fieldDisplayName = i18n.t("forms.record_types.approvals");
  }
  if (field === INCIDENTS) {
    fieldDisplayName = i18n.t("incidents.label");
  }
  const fieldRecordInformation = filterFieldsRecordInformation(field);

  if (fieldRecordInformation.length) {
    fieldDisplayName = i18n.t(`record_information.${field}`);
  }

  if (selectedField) {
    fieldDisplayName = displayNameHelper(selectedField?.get("display_name"), i18n.locale);
  }

  const selectedFieldOptionsSource = selectedField?.get("option_strings_source");
  const selectedFieldOptionsText = selectedField?.get("option_strings_text");

  if (selectedFieldOptionsSource) {
    fieldValueFrom = valueFromOptionSource(
      allAgencies,
      allLookups,
      locations,
      i18n.locale,
      selectedFieldOptionsSource,
      fieldValueFrom
    );
    fieldValueTo = valueFromOptionSource(
      allAgencies,
      allLookups,
      locations,
      i18n.locale,
      selectedFieldOptionsSource,
      fieldValueTo
    );
  }

  if (selectedFieldOptionsText) {
    fieldValueFrom = getFieldValueFromOptionText(i18n, selectedFieldOptionsText, fieldValueFrom);
    fieldValueTo = getFieldValueFromOptionText(i18n, selectedFieldOptionsText, fieldValueTo);
  }

  return {
    fieldDisplayName,
    fieldValueFrom,
    fieldValueTo
  };
};
