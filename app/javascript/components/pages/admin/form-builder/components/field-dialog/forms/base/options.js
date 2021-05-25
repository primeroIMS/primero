import { fromJS } from "immutable";
import { isEmpty } from "lodash";

import {
  FormSectionRecord,
  FieldRecord,
  LABEL_FIELD,
  ORDERABLE_OPTIONS_FIELD,
  SELECT_FIELD
} from "../../../../../../../form";

export const optionsTabs = (fieldName, i18n, mode, field, limitedProductionSite) => {
  const optionStringsText = field?.get("option_strings_text", fromJS([]));

  return [
    {
      name: i18n.t("fields.predifined_lookups"),
      selected: Boolean(field.get("option_strings_source")),
      disabled: !mode.get("isNew") && !field.get("option_strings_source"),
      fields: fromJS([
        FieldRecord({
          display_name: i18n.t("fields.find_lookup"),
          name: `${fieldName}.option_strings_source`,
          type: SELECT_FIELD,
          option_strings_source: "Lookups",
          disabled: mode.get("isEdit"),
          clearDependentValues: [`${fieldName}.selected_value`]
        }),
        FieldRecord({
          display_name: i18n.t("fields.default_value"),
          name: `${fieldName}.selected_value`,
          type: SELECT_FIELD,
          option_strings_source: "Lookups",
          watchedInputs: `${fieldName}.option_strings_source`,
          disabled: limitedProductionSite,
          filterOptionSource: (watchedInputsValues, lookupOptions) => {
            if (!watchedInputsValues) return [];

            const lookupSelected = lookupOptions.find(lookup => lookup.id === watchedInputsValues);

            const newSelectOptions = lookupSelected ? lookupSelected?.values : [];

            return newSelectOptions;
          }
        })
      ])
    },
    {
      name: i18n.t("fields.create_unique_values"),
      selected: !isEmpty(optionStringsText),
      disabled: !mode.get("isNew") && !optionStringsText?.size,
      fields: fromJS([
        FieldRecord({
          display_name: i18n.t("fields.find_lookup"),
          name: `${fieldName}.option_strings_text`,
          type: ORDERABLE_OPTIONS_FIELD,
          disabled: mode.get("isEdit"),
          selected_value: field.get("selected_value"),
          option_strings_text: optionStringsText,
          rawOptions: true
        })
      ])
    }
  ];
};

/* eslint-disable import/prefer-default-export */
export const optionsForm = ({ fieldName, i18n, formMode, field, css, limitedProductionSite }) => {
  const optionsFormFields = [
    FieldRecord({
      display_name: i18n.t("fields.options_indications_lookup_values"),
      name: "options_indications",
      type: LABEL_FIELD,
      disabled: limitedProductionSite
    }),
    FieldRecord({
      display_name: i18n.t("fields.options_indications_restrictions"),
      name: "options_indications_restrictions",
      inputClassname: css.boldLabel,
      type: LABEL_FIELD,
      disabled: limitedProductionSite
    }),
    {
      tabs: optionsTabs(fieldName, i18n, formMode, field, limitedProductionSite),
      handleTabChange: ({ selectedTab, formMode: formTabMode, formMethods }) => {
        if (formTabMode.isNew && selectedTab === 0) {
          formMethods.setValue(`${fieldName}.option_strings_text`, []);
        } else if (formTabMode.isNew && selectedTab === 1) {
          formMethods.setValue(`${fieldName}.option_strings_source`, null);
          formMethods.setValue(`${fieldName}.selected_value`, null);
        }
      }
    }
  ];

  return FormSectionRecord({
    unique_id: "field_form_options",
    name: i18n.t("fields.option_strings_text"),
    fields: optionsFormFields
  });
};
