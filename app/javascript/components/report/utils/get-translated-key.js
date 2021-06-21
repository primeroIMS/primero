/* eslint-disable camelcase */

import { STRING_SOURCES_TYPES } from "../../../config";

export default (key, field, { agencies, i18n, locations } = {}) => {
  const isBooleanKey = ["true", "false"].includes(key);

  if (field?.option_strings_source === STRING_SOURCES_TYPES.AGENCY && agencies?.length > 0) {
    return agencies.find(agency => agency.id.toLowerCase() === key.toLowerCase())?.display_text;
  }

  if (field?.option_strings_source === STRING_SOURCES_TYPES.LOCATION && locations?.length > 0) {
    return locations.find(location => location.id === key.toUpperCase())?.display_text;
  }

  if (i18n && isBooleanKey) {
    return i18n.t(key);
  }

  return key;
};
