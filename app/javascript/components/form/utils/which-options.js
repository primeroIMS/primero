/* eslint-disable import/prefer-default-export */

export const optionText = (option, locale) => {
  const { display_text: displayText, display_name: displayName } = option;

  return displayText instanceof Object || displayName instanceof Object
    ? displayText?.[locale] || displayName?.[locale]
    : displayText || displayName;
};

export const whichOptions = ({
  optionStringsSource,
  options,
  i18n,
  lookups,
  agencies,
  locations
}) => {
  if (optionStringsSource) {
    switch (optionStringsSource) {
      case "Agency":
        return agencies
          .map(agency => ({
            id: agency.get("id"),
            display_text: agency.get("name")
          }))
          .toJS();
      case "Location":
        return locations
          .map(location => ({
            id: location.get("code"),
            display_text: location.getIn(["name", i18n.locale], "")
          }))
          .toJS();
      default:
        return lookups.map(lookup => {
          const displayText = optionText(lookup, i18n.locale);
          const display = lookup.display_text
            ? { display_text: displayText }
            : { display_name: displayText };

          return { ...lookup, ...display };
        });
    }
  }

  return Array.isArray(options) ? options : options?.[i18n.locale];
};
