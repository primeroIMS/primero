import { displayNameHelper } from "../../../libs";
import { ALLOWED_FIELD_TYPES } from "../constants";

import { buildLocationFields, buildField } from "./build-field";

export default (data, i18n, isReportable, reportingLocationConfig) => {
  const { locale } = i18n;

  if (isReportable) {
    if (data.isEmpty()) {
      return [];
    }
    const formSection = displayNameHelper(data.get("name"), locale);

    return data.get("fields").reduce((prev, current) => {
      const lookup = current.get("option_strings_source")?.replace(/lookup /, "");

      if (lookup === "Location") {
        return [...prev, ...buildLocationFields(current, formSection, i18n, reportingLocationConfig)];
      }

      return [...prev, buildField(current, formSection, locale)];
    }, []);
  }

  return data.reduce((acc, form) => {
    // eslint-disable-next-line camelcase
    const fields = form.get("fields");
    const name = form.get("name");

    const filteredFields = fields
      .filter(field => ALLOWED_FIELD_TYPES.includes(field.get("type")) && field.get("visible"))
      .reduce((prev, current) => {
        const lookup = current.get("option_strings_source")?.replace(/lookup /, "");

        if (lookup === "Location") {
          return [
            ...prev,
            ...buildLocationFields(current, displayNameHelper(name, locale), i18n, reportingLocationConfig)
          ];
        }

        return [...prev, buildField(current, displayNameHelper(name, locale), locale)];
      }, []);

    return [...acc, ...filteredFields];
  }, []);
};
