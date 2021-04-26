import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";
import some from "lodash/some";
import { array, boolean, object, string } from "yup";

import { RECORD_TYPES } from "../../../../config/constants";
import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  SELECT_FIELD,
  TICK_FIELD,
  LABEL_FIELD,
  OPTION_TYPES,
  SELECT_CHANGE_REASON
} from "../../../form";

import { FORM_GROUP_FIELD, MODULES_FIELD, RECORD_TYPE_FIELD } from "./constants";
import { validateEnglishName, formGroupsOptions } from "./utils";

export const validationSchema = i18n =>
  object().shape({
    description: object().shape({
      en: string().required(i18n.t("forms.required_field", { field: i18n.t("forms.description") }))
    }),
    form_group_id: string()
      .nullable()
      .required(i18n.t("forms.required_field", { field: i18n.t("forms.form_group") })),
    module_ids: array()
      .of(
        string()
          .nullable()
          .required(i18n.t("forms.required_field", { field: i18n.t("forms.module") }))
      )
      .nullable(),
    name: object().shape({
      en: string()
        .test(
          "name.en",
          i18n.t("forms.invalid_characters_field", { field: i18n.t("forms.title") }),
          validateEnglishName
        )
        .required(i18n.t("forms.required_field", { field: i18n.t("forms.title") }))
    }),
    parent_form: string()
      .nullable()
      .required(i18n.t("forms.required_field", { field: i18n.t("forms.record_type") })),
    visible: boolean()
  });

export const settingsForm = ({ formMode, onManageTranslation, onEnglishTextChange, i18n, limitedProductionSite }) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "settings",
      name: i18n.t("forms.settings"),
      actions: formMode.get("isEdit")
        ? [
            {
              text: i18n.t("forms.translations.manage"),
              outlined: true,
              rest: { onClick: onManageTranslation, hide: limitedProductionSite }
            }
          ]
        : [],
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.title"),
          name: "name.en",
          type: TEXT_FIELD,
          required: true,
          onBlur: e => onEnglishTextChange(e),
          help_text: i18n.t("forms.help_text.must_be_english"),
          disabled: limitedProductionSite
        }),
        FieldRecord({
          display_name: i18n.t("forms.description"),
          name: "description.en",
          type: TEXT_FIELD,
          required: true,
          onBlur: e => onEnglishTextChange(e),
          help_text: i18n.t("forms.help_text.summariaze_purpose"),
          disabled: limitedProductionSite
        }),
        {
          row: [
            FieldRecord({
              display_name: i18n.t("forms.module"),
              name: MODULES_FIELD,
              type: SELECT_FIELD,
              option_strings_source: "Module",
              multipleLimitOne: true,
              required: true,
              clearDependentValues: [RECORD_TYPE_FIELD, [FORM_GROUP_FIELD, []]],
              clearDependentReason: [SELECT_CHANGE_REASON.clear],
              disabled: limitedProductionSite
            }),
            FieldRecord({
              display_name: i18n.t("forms.record_type"),
              name: RECORD_TYPE_FIELD,
              type: SELECT_FIELD,
              option_strings_text: Object.values(RECORD_TYPES).reduce((results, item) => {
                if (item !== RECORD_TYPES.all) {
                  results.push({
                    id: item,
                    display_text: i18n.t(`forms.record_types.${item}`)
                  });
                }

                return results;
              }, []),
              required: true,
              clearDependentValues: [FORM_GROUP_FIELD],
              watchedInputs: MODULES_FIELD,
              handleWatchedInputs: value => {
                return { disabled: isEmpty(value) || limitedProductionSite };
              }
            })
          ]
        },
        FieldRecord({
          display_name: i18n.t("forms.form_group"),
          name: FORM_GROUP_FIELD,
          type: SELECT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.related_groups"),
          watchedInputs: [MODULES_FIELD, RECORD_TYPE_FIELD],
          option_strings_source: OPTION_TYPES.FORM_GROUP_LOOKUP,
          filterOptionSource: (watchedInputValues, options) => {
            const { [MODULES_FIELD]: moduleID, [RECORD_TYPE_FIELD]: parentForm } = watchedInputValues;

            return formGroupsOptions(options, moduleID, parentForm, i18n);
          },
          handleWatchedInputs: values => {
            return { disabled: some(values, isEmpty) || limitedProductionSite };
          }
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "visibility",
      name: i18n.t("forms.visibility"),
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.show_on"),
          name: "show_on",
          type: LABEL_FIELD,
          disabled: limitedProductionSite
        }),
        {
          row: [
            FieldRecord({
              display_name: i18n.t("forms.web_app"),
              name: "visible",
              type: TICK_FIELD,
              disabled: limitedProductionSite
            }),
            FieldRecord({
              display_name: i18n.t("forms.mobile_app"),
              name: "mobile_form",
              type: TICK_FIELD,
              disabled: limitedProductionSite
            })
          ],
          equalColumns: false
        }
      ]
    })
  ]);
};
