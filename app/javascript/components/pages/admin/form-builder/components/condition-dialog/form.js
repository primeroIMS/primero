// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { array, object, string, lazy } from "yup";

import { displayNameHelper } from "../../../../../../libs";
import { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../../form";
import { constraintInputType, valueFieldType } from "../../../../../reports-form/components/filters-dialog/form";
import css from "../../../../../reports-form/components/filters-dialog/styles.css";

import { ATTRIBUTE_FIELD, CONSTRAINTS, CONSTRAINT_FIELD, TYPE_FIELD, VALUE_FIELD } from "./constants";

export const validationSchema = (i18n, isFirstCondition) =>
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
    [TYPE_FIELD]: lazy(() => {
      if (isFirstCondition) {
        return string().nullable();
      }

      return string()
        .nullable()
        .required(
          i18n.t("forms.required_field", {
            field: i18n.t("forms.conditions.type")
          })
        );
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

export const conditionsForm = ({ fields, i18n, selectedField, mode, isFirstCondition = true }) => {
  return [
    FormSectionRecord({
      unique_id: "conditions_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.conditions.type"),
          required: true,
          visible: !isFirstCondition,
          name: TYPE_FIELD,
          type: SELECT_FIELD,
          option_strings_text: [
            { id: "and", display_text: i18n.t("forms.conditions.types.and.display_text") },
            { id: "or", display_text: i18n.t("forms.conditions.types.or.display_text") }
          ]
        }),
        FieldRecord({
          display_name: i18n.t("forms.conditions.field_name"),
          name: ATTRIBUTE_FIELD,
          type: SELECT_FIELD,
          disabled: mode.isEdit,
          groupBy: "form_section_name",
          option_strings_text: fields.map(field => ({
            id: field.name,
            display_text: displayNameHelper(field.display_name, i18n.locale),
            form_section_name: displayNameHelper(field.form_section_name, i18n.locale)
          }))
        }),
        FieldRecord({
          name: CONSTRAINT_FIELD,
          ...constraintInputType(selectedField, CONSTRAINTS, i18n, true, false),
          display_name: i18n.t("forms.conditions.condition")
        }),
        FieldRecord({
          display_name: i18n.t("report.value"),
          name: VALUE_FIELD,
          ...valueFieldType(selectedField, false, css, i18n, false)
        })
      ]
    })
  ];
};
