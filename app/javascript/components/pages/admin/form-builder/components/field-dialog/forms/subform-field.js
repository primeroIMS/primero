import { fromJS } from "immutable";
import { object, string } from "yup";

import { subform, visibilityFields, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const subformField = ({ name, i18n }) => {
  const { showOn, visible, mobileVisible, hideOnViewPage } = visibilityFields(
    name,
    i18n
  );

  return {
    forms: fromJS([
      subform(i18n),
      visibilityForm(name, i18n, [
        showOn,
        { row: [visible, mobileVisible, hideOnViewPage] }
      ])
    ]),
    validationSchema: object().shape({
      subform_section: object().shape({
        name: object({
          en: string().required(
            i18n.t("forms.required_field", {
              field: i18n.t("fields.subform_section.name")
            })
          )
        })
      })
    })
  };
};
