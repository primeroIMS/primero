import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";

import { FieldRecord, SELECT_FIELD, RADIO_FIELD, TEXT_FIELD, TOGGLE_FIELD } from "../../form";

import { isCustomExport, isPdfExport, allowedExports } from "./utils";
import {
  CUSTOM_EXPORT_FILE_NAME_FIELD,
  CUSTOM_FORMAT_TYPE_FIELD,
  EXPORT_TYPE_FIELD,
  FIELDS_TO_EXPORT_FIELD,
  FIELD_ID,
  FORMS_ID,
  FORM_TO_EXPORT_FIELD,
  INDIVIDUAL_FIELDS_FIELD,
  MODULE_FIELD,
  PASSWORD_FIELD
} from "./constants";

export default (i18n, userPermissions, isShowPage, modules, fields, exportFormsOptions, recordType) => {
  return [
    FieldRecord({
      display_name: i18n.t("encrypt.export_type"),
      name: EXPORT_TYPE_FIELD,
      type: SELECT_FIELD,
      option_strings_text: {
        [i18n.locale]: allowedExports(userPermissions, i18n, isShowPage, recordType)
      },
      multi_select: false,
      required: true
    }),
    FieldRecord({
      display_name: i18n.t("report.modules"),
      name: MODULE_FIELD,
      type: SELECT_FIELD,
      watchedInputs: EXPORT_TYPE_FIELD,
      option_strings_text: modules,
      editable: modules.length > 1,
      showIf: value => isCustomExport(value),
      required: isCustomExport && !isShowPage
    }),
    FieldRecord({
      name: CUSTOM_FORMAT_TYPE_FIELD,
      display_name: i18n.t("exports.custom_exports.format_label"),
      type: RADIO_FIELD,
      watchedInputs: EXPORT_TYPE_FIELD,
      showIf: value => isCustomExport(value),
      option_strings_text: {
        [i18n.locale]: [
          {
            id: FORMS_ID,
            label: i18n.t("exports.custom_exports.form_label")
          },
          {
            id: FIELD_ID,
            label: i18n.t("exports.custom_exports.field_label")
          }
        ]
      }
    }),
    FieldRecord({
      name: INDIVIDUAL_FIELDS_FIELD,
      display_name: i18n.t("exports.custom_exports.choose_fields"),
      type: TOGGLE_FIELD,
      watchedInputs: [EXPORT_TYPE_FIELD, CUSTOM_FORMAT_TYPE_FIELD],
      showIf: ({ [EXPORT_TYPE_FIELD]: exportType, [CUSTOM_FORMAT_TYPE_FIELD]: formatType }) =>
        isCustomExport(exportType) && formatType !== FIELD_ID,
      handleWatchedInputs: ({ [CUSTOM_FORMAT_TYPE_FIELD]: formatType }) => ({ disabled: !formatType })
    }),
    FieldRecord({
      display_name: i18n.t("exports.custom_exports.forms"),
      name: FORM_TO_EXPORT_FIELD,
      type: SELECT_FIELD,
      multi_select: true,
      option_strings_text: uniqBy(exportFormsOptions, "id"),
      watchedInputs: [EXPORT_TYPE_FIELD, CUSTOM_FORMAT_TYPE_FIELD, INDIVIDUAL_FIELDS_FIELD],
      showIf: ({
        [EXPORT_TYPE_FIELD]: exportType,
        [CUSTOM_FORMAT_TYPE_FIELD]: formatType,
        [INDIVIDUAL_FIELDS_FIELD]: individualFields
      }) => isPdfExport(exportType) || (formatType === FORMS_ID && !individualFields)
    }),
    FieldRecord({
      display_name: i18n.t("exports.custom_exports.fields"),
      name: FIELDS_TO_EXPORT_FIELD,
      type: SELECT_FIELD,
      multi_select: true,
      groupBy: "formSectionName",
      option_strings_text: fields,
      watchedInputs: [EXPORT_TYPE_FIELD, CUSTOM_FORMAT_TYPE_FIELD, INDIVIDUAL_FIELDS_FIELD],
      showIf: ({
        [EXPORT_TYPE_FIELD]: exportType,
        [CUSTOM_FORMAT_TYPE_FIELD]: formatType,
        [INDIVIDUAL_FIELDS_FIELD]: individualFields
      }) => isCustomExport(exportType) && ((formatType === FORMS_ID && individualFields) || formatType === FIELD_ID)
    }),
    FieldRecord({
      display_name: i18n.t("encrypt.password_label"),
      name: PASSWORD_FIELD,
      type: TEXT_FIELD,
      required: true,
      autoFocus: true,
      help_text: {
        [i18n.locale]: i18n.t("encrypt.password_extra_info")
      },
      password: true,
      watchedInputs: EXPORT_TYPE_FIELD,
      showIf: value => value && !isPdfExport(value)
    }),
    FieldRecord({
      display_name: i18n.t("encrypt.file_name"),
      name: CUSTOM_EXPORT_FILE_NAME_FIELD,
      type: TEXT_FIELD,
      watchedInputs: EXPORT_TYPE_FIELD,
      showIf: value => !isEmpty(value)
    })
  ];
};
