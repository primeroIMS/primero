import { FormSectionRecord } from "../../../../../../../form";

/* eslint-disable import/prefer-default-export */
export const optionsForm = (fieldName, i18n, fields = []) =>
  FormSectionRecord({
    unique_id: "field_form_options",
    name: i18n.t("fields.option_strings_text"),
    fields
  });
