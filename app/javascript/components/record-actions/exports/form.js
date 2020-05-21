import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";

import {
  FieldRecord,
  SELECT_FIELD,
  RADIO_FIELD,
  TEXT_AREA,
  TEXT_FIELD,
  TOGGLE_FIELD
} from "../../form";

import { allowedExports } from "./utils";
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

export default (
  i18n,
  userPermissions,
  isCustomExport,
  isShowPage,
  formatType,
  individualFields,
  css,
  modules,
  fields
) => [
  FieldRecord({
    display_name: i18n.t("encrypt.export_type"),
    name: EXPORT_TYPE_FIELD,
    type: SELECT_FIELD,
    option_strings_text: {
      [i18n.locale]: allowedExports(userPermissions, i18n, isShowPage)
    },
    multi_select: false,
    required: true
  }),
  FieldRecord({
    display_name: i18n.t("report.modules"),
    name: MODULE_FIELD,
    type: SELECT_FIELD,
    option_strings_text: modules,
    editable: modules.length > 1,
    inputClassname:
      !isCustomExport || isShowPage ? css.hideCustomExportFields : null,
    required: isCustomExport && !isShowPage
  }),
  FieldRecord({
    name: CUSTOM_FORMAT_TYPE_FIELD,
    display_name: i18n.t("exports.custom_exports.format_label"),
    type: RADIO_FIELD,
    inputClassname: !isCustomExport ? css.hideCustomExportFields : null,
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
    inputClassname:
      !isCustomExport || formatType === FIELD_ID
        ? css.hideCustomExportFields
        : null,
    disabled: formatType === ""
  }),
  FieldRecord({
    display_name: i18n.t("exports.custom_exports.forms"),
    name: FORM_TO_EXPORT_FIELD,
    type: SELECT_FIELD,
    multi_select: true,
    option_strings_text: uniqBy(
      fields.map(field => ({
        id: field.formSectionId,
        display_text: field.formSectionName
      })),
      "id"
    ),
    inputClassname:
      !isCustomExport ||
      (isCustomExport && isEmpty(formatType)) ||
      individualFields ||
      formatType === FIELD_ID
        ? css.hideCustomExportFields
        : null
  }),
  FieldRecord({
    display_name: i18n.t("exports.custom_exports.fields"),
    name: FIELDS_TO_EXPORT_FIELD,
    type: SELECT_FIELD,
    multi_select: true,
    groupBy: "formSectionName",
    option_strings_text: fields,
    inputClassname:
      !isCustomExport ||
      (isCustomExport && isEmpty(formatType)) ||
      (!individualFields && formatType === FORMS_ID)
        ? css.hideCustomExportFields
        : null
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
    password: true
  }),
  FieldRecord({
    display_name: i18n.t("encrypt.file_name"),
    name: CUSTOM_EXPORT_FILE_NAME_FIELD,
    type: TEXT_AREA
  })
];
