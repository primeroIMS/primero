import { fromJS } from "immutable";
import { array, boolean, object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import { RECORD_TYPES } from "../../../../config/constants";
import { FieldRecord, FormSectionRecord, TEXT_FIELD, SELECT_FIELD, TICK_FIELD, LABEL_FIELD } from "../../../form";

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

export const settingsForm = ({
  formMode,
  onManageTranslation,
  onEnglishTextChange,
  i18n,
  allFormGroupsLookups,
  limitedProductionSite
}) => {
  const checkModuleField = (value, name, { methods }) => {
    const emptyModule = isEmpty(value[MODULES_FIELD]);

    if (name === RECORD_TYPE_FIELD) {
      const isModuleTouched = Object.keys(methods?.formState?.dirtyFields).includes("module_ids");

      if (isModuleTouched && emptyModule) {
        [RECORD_TYPE_FIELD, FORM_GROUP_FIELD].forEach(property => {
          if (!isEmpty(methods.getValues()[property])) {
            methods.setValue(property, "");
          }
        });
      }
    }

    return { disabled: emptyModule };
  };

  const checkModuleAndRecordType = (value, name, { methods }) => {
    const moduleId = value[MODULES_FIELD];
    const parentForm = value[RECORD_TYPE_FIELD];
    const emptyModule = isEmpty(value[MODULES_FIELD]);
    const emptyParentForm = isEmpty(value[RECORD_TYPE_FIELD]);

    if (name === FORM_GROUP_FIELD) {
      const isModuleTouched = Object.keys(methods.control?.formState?.dirtyFields).includes("module_ids");
      const isParentFormTouched = Object.keys(methods.control?.formState?.dirtyFields).includes(RECORD_TYPE_FIELD);

      if (isModuleTouched && emptyModule) {
        [RECORD_TYPE_FIELD, FORM_GROUP_FIELD].forEach(property => {
          if (!isEmpty(methods.getValues()[property])) {
            methods.setValue(property, "");
          }
        });
      }
      if (isParentFormTouched && emptyParentForm) {
        if (!isEmpty(methods.getValues()[FORM_GROUP_FIELD])) {
          methods.setValue(FORM_GROUP_FIELD, "");
        }
      }
    }

    return {
      disabled: isEmpty(moduleId) || isEmpty(parentForm),
      options: formGroupsOptions(allFormGroupsLookups, moduleId, parentForm, i18n)
    };
  };

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
          help_text: i18n.t("forms.help_text.must_be_english")
        }),
        FieldRecord({
          display_name: i18n.t("forms.description"),
          name: "description.en",
          type: TEXT_FIELD,
          required: true,
          onBlur: e => onEnglishTextChange(e),
          help_text: i18n.t("forms.help_text.summariaze_purpose")
        }),
        {
          row: [
            FieldRecord({
              display_name: i18n.t("forms.module"),
              name: MODULES_FIELD,
              type: SELECT_FIELD,
              option_strings_source: "Module",
              required: true
            }),
            FieldRecord({
              display_name: i18n.t("forms.record_type"),
              name: RECORD_TYPE_FIELD,
              type: SELECT_FIELD,
              watchedInputs: [MODULES_FIELD],
              handleWatchedInputs: checkModuleField,
              option_strings_text: Object.values(RECORD_TYPES).reduce((results, item) => {
                if (item !== RECORD_TYPES.all) {
                  results.push({
                    id: item,
                    display_text: i18n.t(`forms.record_types.${item}`)
                  });
                }

                return results;
              }, []),
              required: true
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
          handleWatchedInputs: checkModuleAndRecordType
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
          type: LABEL_FIELD
        }),
        {
          row: [
            FieldRecord({
              display_name: i18n.t("forms.web_app"),
              name: "visible",
              type: TICK_FIELD
            }),
            FieldRecord({
              display_name: i18n.t("forms.mobile_app"),
              name: "mobile_form",
              type: TICK_FIELD
            })
          ],
          equalColumns: false
        }
      ]
    })
  ]);
};
