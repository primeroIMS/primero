import { displayNameHelper } from "../../../libs";

export const buildField = (current, formSection, locale) => ({
  id: current.get("name"),
  display_text: displayNameHelper(current.get("display_name"), locale),
  formSection,
  type: current.get("type"),
  option_strings_source: current.get("option_strings_source")?.replace(/lookup /, ""),
  option_strings_text: current.get("option_strings_text"),
  tick_box_label: current.getIn(["tick_box_label", locale])
});

export const buildLocationFields = (current, formSection, i18n, reportingLocationConfig) => {
  const { locale } = i18n;

  const locationFields = [buildField(current, formSection, locale)];

  const adminLevel = reportingLocationConfig?.get("admin_level");
  const adminLevelMap = reportingLocationConfig?.get("admin_level_map");

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= adminLevel; i++) {
    locationFields.push({
      ...buildField(current, formSection, locale),
      id: `${current.get("name")}${i}`,
      display_text: `${displayNameHelper(current.get("display_name"), locale)} (${i18n.t(
        `location.base_types.${adminLevelMap.getIn([String(i), 0])}`
      )})`
    });
  }

  return locationFields;
};
