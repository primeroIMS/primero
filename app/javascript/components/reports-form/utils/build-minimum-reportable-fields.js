import uniqBy from "lodash/uniqBy";
import isEmpty from "lodash/isEmpty";

import { displayNameHelper } from "../../../libs";
import { MINIMUM_REPORTABLE_FIELDS } from "../constants";

export default (i18n, forms) => {
  const result = Object.entries(MINIMUM_REPORTABLE_FIELDS).reduce((accumulator, current) => {
    const [key, fields] = current;

    const filteredForms = forms.filter(form => form.get("parent_form") === key);

    const onlyFields = filteredForms.reduce((acc, filteredForm) => {
      const fieldsToEval = filteredForm.fields.filter(field => fields.includes(field.name));

      if (isEmpty(fieldsToEval)) {
        return acc;
      }
      const fieldsResult = fieldsToEval.map(field => ({
        id: field.get("name"),
        display_text: displayNameHelper(field.get("display_name"), i18n.locale),
        formSection: i18n.t("minimum_reportable_fields", { record_type: key }),
        type: field.get("type"),
        option_strings_source: field.get("option_strings_source")?.replace(/lookup /, ""),
        option_strings_text: field.get("option_strings_text"),
        tick_box_label: field.getIn(["tick_box_label", i18n.locale])
      }));

      return [...acc, fieldsResult];
    }, []);

    return { ...accumulator, [key]: [...uniqBy(onlyFields.flat(), "id")] };
  }, {});

  return result;
};
