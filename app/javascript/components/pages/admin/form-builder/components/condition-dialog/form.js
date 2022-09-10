/* eslint-disable import/prefer-default-export */
import { array, object, string, lazy } from "yup";

import { displayNameHelper } from "../../../../../../libs";
import { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../../form";
import { constraintInputType, valueFieldType } from "../../../../../reports-form/components/filters-dialog/form";
import css from "../../../../../reports-form/components/filters-dialog/styles.css";

import { ATTRIBUTE_FIELD, CONSTRAINTS, CONSTRAINT_FIELD, DATE_CONSTRAINTS, VALUE_FIELD } from "./constants";

export const validationSchema = i18n =>
  object().shape({
    [ATTRIBUTE_FIELD]: string()
      .nullable()
      .required(
        i18n.t("forms.required_field", {
          field: i18n.t("report.attribute")
        })
      ),
    [CONSTRAINT_FIELD]: string().when(VALUE_FIELD, {
      is: Array.isArray,
      then: string().nullable(),
      otherwise: string()
        .nullable()
        .required(
          i18n.t("forms.required_field", {
            field: i18n.t("report.constraint")
          })
        )
    }),
    [VALUE_FIELD]: lazy(val => {
      const schema = Array.isArray(val) ? array().of(string()) : string();

      return schema.when(CONSTRAINT_FIELD, {
        is: value => value === "not_null",
        then: schema.nullable(),
        otherwise: schema.nullable().required(
          i18n.t("forms.required_field", {
            field: i18n.t("report.value")
          })
        )
      });
    })
  });

export const conditionsForm = ({ fields, i18n, selectedField, isNotNullConstraint }) => {
  return [
    FormSectionRecord({
      unique_id: "conditions_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("report.attribute"),
          name: ATTRIBUTE_FIELD,
          type: SELECT_FIELD,
          option_strings_text: fields.map(field => ({
            id: field.name,
            display_text: displayNameHelper(field.display_name, i18n.locale)
          }))
        }),
        FieldRecord({
          name: CONSTRAINT_FIELD,
          ...constraintInputType(selectedField, { default: CONSTRAINTS, date: DATE_CONSTRAINTS }, i18n, true)
        }),
        FieldRecord({
          display_name: i18n.t("report.value"),
          name: VALUE_FIELD,
          ...valueFieldType(selectedField, isNotNullConstraint, css, i18n)
        })
      ]
    })
  ];
};
