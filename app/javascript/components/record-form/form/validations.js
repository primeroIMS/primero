/* eslint-disable import/prefer-default-export */
import { number, date, array, object, string } from "yup";
import { addDays } from "date-fns";

import {
  NUMERIC_FIELD,
  DATE_FIELD,
  SUBFORM_SECTION,
  NOT_FUTURE_DATE
} from "../constants";

export const fieldValidations = (field, i18n) => {
  const { name, type, required } = field;
  const validations = {};

  if (NUMERIC_FIELD === type) {
    if (name.match(/.*age$/)) {
      validations[name] = number()
        .nullable()
        .transform(value => (Number.isNaN(value) ? null : value))
        .positive()
        .min(0, i18n.t("errors.models.child.age"))
        .max(130, i18n.t("errors.models.child.age"));
    } else {
      validations[name] = number().nullable().min(0).max(2147483647);
    }
  } else if (DATE_FIELD === type) {
    validations[name] = date().nullable();
    if (field.date_validation === NOT_FUTURE_DATE) {
      validations[name] = validations[name].max(
        addDays(new Date(), 1),
        i18n.t("fields.future_date_not_valid")
      );
    }
  } else if (SUBFORM_SECTION === type) {
    const subformSchema = field.subform_section_id.fields.map(sf => {
      return fieldValidations(sf, i18n);
    });

    validations[name] = array().of(
      object().shape(Object.assign({}, ...subformSchema))
    );
  }

  if (required) {
    validations[name] = (validations[name] || string()).nullable().required(
      i18n.t("form_section.required_field", {
        field: field.display_name[i18n.locale]
      })
    );
  }

  return validations;
};
