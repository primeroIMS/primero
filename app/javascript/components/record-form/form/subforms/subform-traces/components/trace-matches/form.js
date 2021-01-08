/* eslint-disable import/prefer-default-export */
import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../../../../form";

export default i18n =>
  FormSectionRecord({
    unique_id: "trace_inquirer",
    fields: [
      FieldRecord({
        display_name: i18n.t("tracing_requests.id"),
        name: "id",
        type: TEXT_FIELD,
        required: true,
        autoFocus: true
      }),
      FieldRecord({
        display_name: i18n.t("tracing_requests.date_of_inquiry"),
        name: "date_of_inquiry",
        type: TEXT_FIELD,
        required: true
      }),
      FieldRecord({
        display_name: i18n.t("tracing_requests.name"),
        name: "name_of_inquirer",
        type: TEXT_FIELD
      })
    ]
  });
