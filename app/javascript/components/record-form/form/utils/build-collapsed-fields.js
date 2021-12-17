import isEmpty from "lodash/isEmpty";

import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../../config";
import { NAME_FIELD, DATE_FIELD, SELECT_FIELD, TICK_FIELD, RADIO_FIELD } from "../../constants";
import SubformLookupHeader from "../subforms/subform-header-lookup";

export default ({ collapsedFieldNames, values, fields, i18n }) => {
  if (isEmpty(collapsedFieldNames) || isEmpty(fields)) {
    return [];
  }

  return collapsedFieldNames
    .map(collapsedFieldName => {
      const {
        type,
        date_include_time: includeTime,
        option_strings_source: optionsStringSource,
        option_strings_text: optionsStringText,
        tick_box_label: tickBoxLabel
      } = fields.find(f => f.get(NAME_FIELD) === collapsedFieldName);
      const value = values[collapsedFieldName];

      if (!value || isEmpty(value)) return <span>{value || ""}</span>;

      switch (type) {
        case DATE_FIELD: {
          const dateFormat = includeTime ? DATE_TIME_FORMAT : DATE_FORMAT;
          const dateValue = i18n.localizeDate(value, dateFormat);

          return dateValue;
        }
        case TICK_FIELD: {
          return tickBoxLabel[i18n.locale] || i18n.t("yes_label");
        }
        case RADIO_FIELD:
        case SELECT_FIELD: {
          const lookupComponentProps = {
            value: typeof value === "boolean" ? value.toString() : value,
            key: collapsedFieldName,
            optionsStringSource,
            optionsStringText,
            isViolationSubform: false
          };

          return <SubformLookupHeader {...lookupComponentProps} />;
        }
        default:
          return <span>{value}</span>;
      }
    })
    .filter(i => i);
};
