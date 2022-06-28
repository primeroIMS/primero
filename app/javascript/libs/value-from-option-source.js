/* eslint-disable camelcase */
import { List } from "immutable";

import { LOOKUPS, STRING_SOURCES_TYPES } from "../config";

import displayNameHelper from "./display-name-helper";

const getValueFromOptions = (allAgencies, allLookups, locations, locale, optionSelected, value) => {
  if (!value) {
    return undefined;
  }
  const valueToTranslated = typeof value === "boolean" ? value.toString() : value;

  if ([STRING_SOURCES_TYPES.LOCATION, LOOKUPS.reporting_locations].includes(optionSelected)) {
    return locations.find(location => location.id === valueToTranslated)?.display_text;
  }

  if (optionSelected === STRING_SOURCES_TYPES.AGENCY) {
    return allAgencies.find(agency => agency.id === valueToTranslated)?.display_text;
  }
  const lookupValue = allLookups
    ?.find(lookup => lookup.get("unique_id") === optionSelected.replace(/lookup /, ""))
    ?.get("values")
    ?.find(v => v.get("id") === valueToTranslated);

  return lookupValue ? displayNameHelper(lookupValue.get("display_text"), locale) : value;
};

export default (allAgencies, allLookups, locations, locale, selectedFieldOptionsSource, fieldValue) => {
  if (List.isList(fieldValue) || Array.isArray(fieldValue)) {
    return fieldValue.map(value =>
      getValueFromOptions(allAgencies, allLookups, locations, locale, selectedFieldOptionsSource, value)
    );
  }

  return getValueFromOptions(allAgencies, allLookups, locations, locale, selectedFieldOptionsSource, fieldValue);
};
