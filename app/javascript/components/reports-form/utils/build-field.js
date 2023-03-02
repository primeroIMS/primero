import { displayNameHelper } from "../../../libs";

export const buildField = (current, formSection, locale) => ({
  id: current.get("name"),
  display_text: displayNameHelper(current.get("display_name"), locale),
  formSection,
  type: current.get("type"),
  option_strings_source: current.get("option_strings_source")?.replace(/lookup /, ""),
  option_strings_text: current.get("option_strings_text"),
  tick_box_label: current.getIn(["tick_box_label", locale]),
  visible: current.get("visible")
});

export const buildLocationFields = (current, formSection, i18n, reportingLocationConfig) => {
  const { locale } = i18n;

  const adminLevelMap = reportingLocationConfig?.get("admin_level_map");

  return [
    {
      ...buildField(current, formSection, locale),
      id: current.get("name"),
      display_text: `${displayNameHelper(current.get("display_name"), locale)}`
    }
  ].concat(
    adminLevelMap?.entrySeq()?.reduce(
      (acc, [key, value]) =>
        acc.concat({
          ...buildField(current, formSection, locale),
          id: `${current.get("name")}${key}`,
          display_text: `${displayNameHelper(current.get("display_name"), locale)} (${i18n.t(
            `location.base_types.${value.first()}`
          )})`
        }),
      []
    )
  );
};
