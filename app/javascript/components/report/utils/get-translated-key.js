/* eslint-disable camelcase */

import { STRING_SOURCES_TYPES } from "../../../config";
import { hasApiDateFormat } from "../../../libs";

const isBooleanKey = key => ["true", "false"].includes(key);

export default (key, field, { agencies, i18n, locations, groupDatesBy } = {}) => {
  const incompleteDataLabel = i18n.t("report.incomplete_data");

  if (key === "incomplete_data" || key === incompleteDataLabel) {
    return incompleteDataLabel;
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

  if (key.includes("..")) {
    const [start, end] = key.split("..");

    if (hasApiDateFormat(start)) {
      if (groupDatesBy === "year") {
        return i18n.localizeDate(start, "yyyy");
      }
      if (groupDatesBy === "month") {
        return `${i18n.localizeDate(start, "MMM")} - ${i18n.localizeDate(start, "yyyy")}`;
      }
      if (groupDatesBy === "week") {
        return `${i18n.localizeDate(start)} - ${i18n.localizeDate(end)}`;
      }
      if (groupDatesBy === "date") {
        return i18n.localizeDate(start);
      }
    } else {
      return key;
    }
  }

  return key;
};
