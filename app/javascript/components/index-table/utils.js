/* eslint-disable camelcase */
import { List } from "immutable";

import { displayNameHelper } from "../../libs";
import { OPTION_TYPES } from "../form/constants";

const getValueFromOptions = (allAgencies, allLookups, locations, locale, optionSelected, value) => {
  const valueToTranslated = typeof value === "boolean" ? value.toString() : value;

  if (optionSelected === OPTION_TYPES.LOCATION) {
    return locations.find(location => location.id === valueToTranslated)?.display_text;
  }

  if (optionSelected === OPTION_TYPES.AGENCY) {
    const agencySelected = allAgencies.find(agency => agency.get("id") === valueToTranslated).get("name");

    return displayNameHelper(agencySelected, locale);
  }
  const lookupValue = allLookups
    ?.find(lookup => lookup.get("unique_id") === optionSelected.replace(/lookup /, ""))
    ?.get("values")
    ?.find(v => v.get("id") === valueToTranslated);

  return lookupValue ? displayNameHelper(lookupValue.get("display_text"), locale) : value;
};

export default (allAgencies, allLookups, locations, locale, selectedFieldOptionsSource, fieldValue) => {
  if (List.isList(fieldValue)) {
    return fieldValue.map(value =>
      getValueFromOptions(allAgencies, allLookups, locations, locale, selectedFieldOptionsSource, value)
    );
  }

  return getValueFromOptions(allAgencies, allLookups, locations, locale, selectedFieldOptionsSource, fieldValue);
};
