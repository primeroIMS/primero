/* eslint-disable import/prefer-default-export */
import { object, string } from "yup";

import { displayNameHelper } from "../../../../../../libs";
import { COMPARISON_OPERATORS } from "../../../../../../libs/expressions/constants";
import { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../../form";

import { ATTRIBUTE_FIELD, CONSTRAINT_FIELD, VALUE_FIELD } from "./constants";

const OPERATOR_OPTIONS = Object.freeze([
  { id: COMPARISON_OPERATORS.EQ, display_text: "=" },
  { id: COMPARISON_OPERATORS.GE, display_text: ">=" },
  { id: COMPARISON_OPERATORS.GT, display_text: ">" },
  { id: COMPARISON_OPERATORS.LE, display_text: "<=" },
  { id: COMPARISON_OPERATORS.LT, display_text: "<" },
  { id: COMPARISON_OPERATORS.IN, display_text: "in" }
]);

export const validationSchema = i18n =>
  object().shape({
    [ATTRIBUTE_FIELD]: string()
      .nullable()
      .required(
        i18n.t("forms.required_field", {
          field: i18n.t("forms.conditions.attribute")
        })
      ),
    [CONSTRAINT_FIELD]: string()
      .nullable()
      .required(
        i18n.t("forms.required_field", {
          field: i18n.t("forms.conditions.constraint")
        })
      ),
    [VALUE_FIELD]: string()
      .nullable()
      .required(
        i18n.t("forms.required_field", {
          field: i18n.t("forms.conditions.value")
        })
      )
  });

export const conditionsForm = ({ fields, i18n, selectedField }) => {
  return [
    FormSectionRecord({
      unique_id: "conditions_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.conditions.attribute"),
          name: ATTRIBUTE_FIELD,
          type: SELECT_FIELD,
          option_strings_text: fields.map(field => ({
            id: field.name,
            display_text: displayNameHelper(field.display_name, i18n.locale)
          }))
        }),
        FieldRecord({
          display_name: i18n.t("forms.conditions.constraint"),
          name: CONSTRAINT_FIELD,
          type: SELECT_FIELD,
          option_strings_text: OPERATOR_OPTIONS
        }),
        FieldRecord({
          display_name: i18n.t("forms.conditions.value"),
          name: VALUE_FIELD,
          type: selectedField?.type,
          option_strings_source: selectedField?.option_strings_source,
          option_strings_text: selectedField?.option_strings_text
        })
      ]
    })
  ];
};
