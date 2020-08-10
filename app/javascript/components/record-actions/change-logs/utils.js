/* eslint-disable import/prefer-default-export */
import { FIELDS } from "../../record-owner/constants";

import { APPROVALS } from "./constants";

const getValueFromOptions = (
  allLookups,
  locations,
  i18n,
  optionSelected,
  value
) => {
  const valueToTranslated =
    typeof value === "boolean" ? value.toString() : value;

  switch (optionSelected) {
    case "Location":
      return locations
        .filter(location => location.get("code") === valueToTranslated)
        ?.first()
        ?.get("name")
        ?.get(i18n.locale);

    default:
      return allLookups
        ?.find(
          lookup =>
            lookup.get("unique_id") === optionSelected.replace(/lookup /, "")
        )
        ?.get("values")
        ?.find(v => v.get("id") === valueToTranslated)
        ?.get("display_text")
        ?.get(i18n.locale);
  }
};

const getFieldValueFromOptionSource = (
  allLookups,
  locations,
  i18n,
  selectedFieldOptionsSource,
  fieldValue
) => {
  if (Array.isArray(fieldValue)) {
    return fieldValue.map(valueFrom =>
      getValueFromOptions(
        allLookups,
        locations,
        i18n,
        selectedFieldOptionsSource,
        valueFrom
      )
    );
  }

  return getValueFromOptions(
    allLookups,
    locations,
    i18n,
    selectedFieldOptionsSource,
    fieldValue
  );
};

const getFieldValueFromOptionText = (
  i18n,
  selectedFieldOptionsText,
  fieldValue
) => {
  const valueTranslated = value =>
    selectedFieldOptionsText?.[i18n.locale]?.find(
      optionStringText => optionStringText.id === value
      // eslint-disable-next-line camelcase
    )?.display_text;

  if (Array.isArray(fieldValue)) {
    return fieldValue.map(value => valueTranslated(value));
  }

  return valueTranslated(fieldValue);
};

export const getFieldsAndValuesTranslations = (
  allFields,
  allLookups,
  locations,
  i18n,
  field,
  value
) => {
  let fieldDisplayName;
  let fieldValueFrom = value.from;
  let fieldValueTo = value.to;

  if (field === APPROVALS) {
    fieldDisplayName = i18n.t("forms.record_types.approvals");
  }
  const fieldRecordInformation = FIELDS.filter(
    fieldInformation => fieldInformation.name === field
  );

  if (fieldRecordInformation.length) {
    fieldDisplayName = i18n.t(`record_information.${field}`);
  }

  const selectedField = allFields.filter(
    recordField => recordField.name === field
  );

  if (selectedField.size) {
    fieldDisplayName = selectedField?.first()?.get("display_name")[i18n.locale];
  }

  const selectedFieldOptionsSource = selectedField
    ?.first()
    ?.get("option_strings_source");
  const selectedFieldOptionsText = selectedField
    ?.first()
    ?.get("option_strings_text");

  if (selectedFieldOptionsSource) {
    fieldValueFrom = getFieldValueFromOptionSource(
      allLookups,
      locations,
      i18n,
      selectedFieldOptionsSource,
      fieldValueFrom
    );
    fieldValueTo = getFieldValueFromOptionSource(
      allLookups,
      locations,
      i18n,
      selectedFieldOptionsSource,
      fieldValueTo
    );
  }

  if (selectedFieldOptionsText?.[i18n.locale]) {
    fieldValueFrom = getFieldValueFromOptionText(
      i18n,
      selectedFieldOptionsText,
      fieldValueFrom
    );
    fieldValueTo = getFieldValueFromOptionText(
      i18n,
      selectedFieldOptionsText,
      fieldValueTo
    );
  }

  return {
    fieldDisplayName,
    fieldValueFrom,
    fieldValueTo
  };
};
