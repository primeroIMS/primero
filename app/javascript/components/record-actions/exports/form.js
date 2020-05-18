import {
  FieldRecord,
  SELECT_FIELD,
  RADIO_FIELD,
  TEXT_AREA,
  TEXT_FIELD,
  TOGGLE_FIELD
} from "../../form";

import { allowedExports } from "./utils";
import { FIELD_ID, FORMS_ID } from "./constants";

export default (
  i18n,
  userPermissions,
  isCustomExport,
  isShowPage,
  showFormSelect,
  showFieldSelect,
  css,
  hideFieldSelect,
  hideFormSelect
) => [
  FieldRecord({
    display_name: i18n.t("encrypt.export_type"),
    name: "export_type",
    type: SELECT_FIELD,
    option_strings_text: {
      [i18n.locale]: allowedExports(userPermissions, i18n, isShowPage)
    },
    multi_select: false,
    required: true
  }),
  FieldRecord({
    name: "custom_format_type",
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
    name: "individual_fields",
    display_name: i18n.t("exports.custom_exports.choose_fields"),
    type: TOGGLE_FIELD,
    inputClassname:
      !isCustomExport || !showFormSelect ? css.hideCustomExportFields : null
  }),
  FieldRecord({
    display_name: i18n.t("exports.custom_exports.forms"),
    name: "form_to_export",
    type: SELECT_FIELD,
    multi_select: true,
    option_strings_source: "Module",
    inputClassname: hideFormSelect ? css.hideCustomExportFields : null
  }),
  FieldRecord({
    display_name: i18n.t("exports.custom_exports.fields"),
    name: "fields_to_export",
    type: SELECT_FIELD,
    multi_select: true,
    option_strings_source: "",
    inputClassname: hideFieldSelect ? css.hideCustomExportFields : null
  }),
  FieldRecord({
    display_name: i18n.t("encrypt.password_label"),
    name: "password",
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
    name: "custom_export_file_name",
    type: TEXT_AREA
  })
];
