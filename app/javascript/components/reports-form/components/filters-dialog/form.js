import { fromJS } from "immutable";

import {
  FormSectionRecord,
  FieldRecord,
  SELECT_FIELD,
  TEXT_FIELD,
  TICK_FIELD,
  RADIO_FIELD,
  DATE_FIELD
} from "../../../form";
import { CONSTRAINTS } from "../../constants";

import { ATTRIBUTE, CONSTRAINT, VALUE } from "./constants";

// TODO: Move to util's file
const valueFieldType = (currentField, isConstraintNotNull, css, i18n) => {
  // console.log("FIELD", currentField);
  const commonProps = {
    type: TEXT_FIELD,
    inputClassname: isConstraintNotNull ? css.hideValue : ""
  };

  if (typeof currentField === "undefined") {
    return commonProps;
  }

  switch (currentField.type) {
    case RADIO_FIELD:
    case SELECT_FIELD: {
      if (currentField.option_strings_source) {
        return {
          ...commonProps,
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_source: currentField.option_strings_source
        };
      }

      return {
        ...commonProps,
        type: SELECT_FIELD,
        multi_select: true,
        option_strings_text: currentField.option_strings_text[i18n.locale]
      };
    }
    case TICK_FIELD: {
      const options = [
        {
          id: false,
          display_text: "Not Selected"
        }
      ];

      if (currentField.tick_box_label) {
        options.push({
          id: true,
          display_text: currentField.tick_box_label
        });
      }

      return {
        ...commonProps,
        type: SELECT_FIELD,
        multi_select: true,
        option_strings_text: options
      };
    }
    case DATE_FIELD:
      return {
        ...commonProps,
        type: DATE_FIELD
      };
    default:
      return commonProps;
  }
};

// TODO: Move to util's file
const constraintInputType = (currentField, i18n) => {
  const allowedTickboxConstraint = [SELECT_FIELD, TICK_FIELD, RADIO_FIELD];

  if (allowedTickboxConstraint.includes(currentField?.type)) {
    return {
      display_name: "Is not blank?",
      type: TICK_FIELD
    };
  }

  return {
    display_name: i18n.t("report.constraint"),
    type: SELECT_FIELD,
    option_strings_text: Object.entries(CONSTRAINTS).map(value => {
      // eslint-disable-next-line camelcase
      const [id, display_text] = value;

      return {
        id,
        display_text
      };
    })
  };
};

export default (i18n, fields, currentField, isConstraintNotNull, css) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "reportFilter",
      fields: [
        FieldRecord({
          display_name: i18n.t("report.attribute"),
          name: ATTRIBUTE,
          type: SELECT_FIELD,
          groupBy: "formSection",
          option_strings_text: fields
        }),
        FieldRecord({
          name: CONSTRAINT,
          ...constraintInputType(currentField, i18n)
        }),
        FieldRecord({
          display_name: i18n.t("report.value"),
          name: VALUE,
          ...valueFieldType(currentField, isConstraintNotNull, css, i18n)
        })
      ]
    })
  ]);
};
