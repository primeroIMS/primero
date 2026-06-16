import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, DATE_FIELD, TEXT_AREA, TEXT_FIELD } from "../../../form";

export const validations = () =>
  object().shape({
    description: string(),
    name: string().required()
  });

export const form = (i18n, isShow) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "configurations",
      fields: [
        FieldRecord({
          display_name: i18n.t("configurations.attributes.name"),
          name: "name",
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.description"),
          name: "description",
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.version"),
          name: "version",
          type: TEXT_FIELD,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.primero_version"),
          name: "primero_version",
          type: TEXT_FIELD,
          editable: false,
          disabled: true,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.date_created"),
          name: "created_on",
          type: DATE_FIELD,
          visible: isShow,
          date_include_time: true
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.created_by"),
          name: "created_by",
          type: TEXT_FIELD,
          visible: isShow
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.last_applied_on"),
          name: "applied_on",
          type: DATE_FIELD,
          visible: isShow,
          date_include_time: true
        }),
        FieldRecord({
          display_name: i18n.t("configurations.attributes.last_applied_by"),
          name: "applied_by",
          type: TEXT_FIELD,
          visible: isShow
        })
      ]
    })
  ]);
};
