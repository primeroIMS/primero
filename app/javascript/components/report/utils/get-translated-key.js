/* eslint-disable camelcase */

import { STRING_SOURCES_TYPES } from "../../../config";

const isBooleanKey = key => ["true", "false"].includes(key);

export default (key, field, { agencies, i18n, locations } = {}) => {
  if (key === "incomplete_data") {
    return i18n.t("report.incomplete_data");
  }

  if (field?.option_strings_source === STRING_SOURCES_TYPES.AGENCY && agencies?.length > 0) {
    return agencies.find(agency => agency.id.toLowerCase() === key.toLowerCase())?.display_text;
  }

  if (field?.option_strings_source === STRING_SOURCES_TYPES.LOCATION && locations?.length > 0) {
    return locations.find(location => location.id === key.toUpperCase())?.display_text;
  }

  if (i18n && isBooleanKey(key)) {
    return i18n.t(key);
  }

  return key;
};
