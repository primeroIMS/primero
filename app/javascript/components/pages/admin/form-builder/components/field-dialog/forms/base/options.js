import { fromJS } from "immutable";

import {
  FormSectionRecord,
  FieldRecord,
  LABEL_FIELD,
  ORDERABLE_OPTIONS_FIELD,
  SELECT_FIELD
} from "../../../../../../../form";

export const optionsTabs = (fieldName, i18n, mode, field, lookups) => {
  const options = field?.get("option_strings_text", fromJS({}));

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
          onChange: methods => {
            methods.reset({ [fieldName]: { selected_value: "" } });
          }
        }),
        FieldRecord({
          display_name: i18n.t("fields.default_value"),
          name: `${fieldName}.selected_value`,
          type: SELECT_FIELD,
          option_strings_source:
            mode.get("isEdit") && field.get("option_strings_source"),
          watchedInputs: [`${fieldName}.option_strings_source`],
          handleWatchedInputs: value => {
            const emptyOptions = [{ id: "", display_text: "" }];
            const lookupSelected = lookups.find(
              lookup =>
                lookup.get("unique_id") ===
                Object.values(value)[0]?.split(" ")?.pop()
            );
            const newSelectOptions = lookupSelected
              ? emptyOptions.concat(
                  lookupSelected
                    .get("values")
                    .toJS()
                    .map(lk => ({
                      id: lk.id,
                      display_text: lk.display_text[i18n.locale]
                    }))
                )
              : [];

            return {
              options: newSelectOptions
            };
          }
        })
      ])
    },
    {
      name: i18n.t("fields.create_unique_values"),
      selected: Boolean(options?.size),
      disabled: !mode.get("isNew") && !options?.size,
      fields: fromJS([
        FieldRecord({
          display_name: i18n.t("fields.find_lookup"),
          name: `${fieldName}.option_strings_text`,
          type: ORDERABLE_OPTIONS_FIELD,
          disabled: mode.get("isEdit"),
          selected_value: field.get("selected_value"),
          option_strings_text: options?.size ? options.toJS() : {}
        })
      ])
    }
  ];
};

/* eslint-disable import/prefer-default-export */
export const optionsForm = (fieldName, i18n, mode, field, lookups, css) => {
  const optionsFormFields = [
    FieldRecord({
      display_name: i18n.t("fields.options_indications_lookup_values"),
      name: "options_indications",
      type: LABEL_FIELD
    }),
    FieldRecord({
      display_name: i18n.t("fields.options_indications_restrictions"),
      name: "options_indications",
      inputClassname: css.boldLabel,
      type: LABEL_FIELD
    }),
    {
      tabs: optionsTabs(fieldName, i18n, mode, field, lookups)
    }
  ];

  return FormSectionRecord({
    unique_id: "field_form_options",
    name: i18n.t("fields.option_strings_text"),
    fields: optionsFormFields
  });
};
