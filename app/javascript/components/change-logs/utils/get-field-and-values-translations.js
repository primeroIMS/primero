/* eslint-disable camelcase */
import { displayNameHelper } from "../../../libs";
import { FIELDS } from "../../record-owner/constants";
import { OPTION_TYPES } from "../../form/constants";
import { APPROVALS, INCIDENTS } from "../constants";

const getValueFromOptions = (allAgencies, allLookups, locations, i18n, optionSelected, value) => {
  const valueToTranslated = typeof value === "boolean" ? value.toString() : value;

  if (optionSelected === OPTION_TYPES.LOCATION) {
    return locations.find(location => location.id === valueToTranslated)?.display_text;
  }

  if (optionSelected === OPTION_TYPES.AGENCY) {
    return allAgencies.find(agency => agency.id === valueToTranslated)?.display_text;
  }

  const lookupValue = allLookups
    ?.find(lookup => lookup.get("unique_id") === optionSelected.replace(/lookup /, ""))
    ?.get("values")
    ?.find(v => v.get("id") === valueToTranslated);

  return lookupValue ? displayNameHelper(lookupValue.get("display_text"), i18n.locale) : value;
};

const getFieldValueFromOptionSource = (
  allAgencies,
  allLookups,
  locations,
  i18n,
  selectedFieldOptionsSource,
  fieldValue
) => {
  if (Array.isArray(fieldValue)) {
    return fieldValue.map(valueFrom =>
      getValueFromOptions(allAgencies, allLookups, locations, i18n, selectedFieldOptionsSource, valueFrom)
    );
  }

  return getValueFromOptions(allAgencies, allLookups, locations, i18n, selectedFieldOptionsSource, fieldValue);
};

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
    fieldValueFrom = getFieldValueFromOptionSource(
      allAgencies,
      allLookups,
      locations,
      i18n,
      selectedFieldOptionsSource,
      fieldValueFrom
    );
    fieldValueTo = getFieldValueFromOptionSource(
      allAgencies,
      allLookups,
      locations,
      i18n,
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
