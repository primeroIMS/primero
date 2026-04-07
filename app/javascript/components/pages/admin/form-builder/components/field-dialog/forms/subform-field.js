import { fromJS } from "immutable";
import { object, string } from "yup";

import { validateEnglishName } from "../../../utils";

import { generalForm, generalFields, subform, visibilityFields, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const subformField = ({ field, i18n, formMode, onManageTranslations, limitedProductionSite }) => {
  const fieldName = field.get("name");
  const { showOn, visible, mobileVisible, hideOnViewPage } = visibilityFields({
    fieldName,
    i18n,
    limitedProductionSite
  });
  const { disabled } = generalFields({ fieldName, formMode, i18n });

  return {
    forms: fromJS([
      subform({ i18n, limitedProductionSite }),
      generalForm({
        fields: [disabled],
        fieldName,
        formMode,
        i18n,
        onManageTranslations,
        limitedProductionSite
      }),
      visibilityForm({
        fieldName,
        i18n,
        fields: [showOn, { row: [visible, mobileVisible, hideOnViewPage] }]
      })
    ]),
    validationSchema: object().shape({
      subform_section: object().shape({
        name: object({
          en: string()
            .test(
              "subform_section.name.en",
              i18n.t("forms.invalid_characters_field", { field: i18n.t("forms.title") }),
              validateEnglishName
            )
            .required(
              i18n.t("forms.required_field", {
                field: i18n.t("fields.subform_section.name")
              })
            )
        })
      })
    })
  };
};
