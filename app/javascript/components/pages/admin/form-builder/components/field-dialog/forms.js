import { fromJS } from "immutable";
import { boolean, object, string } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TICK_FIELD,
  LABEL_FIELD
} from "../../../../../form";

export const validationSchema = (fieldName, i18n) =>
  object().shape({
    [fieldName]: object().shape({
      display_name: object().shape({
        en: string().required(
          i18n.t("forms.required_field", { field: i18n.t("fields.name") })
        )
      }),
      help_text: object().shape({
        en: string()
      }),
      required: boolean()
    })
  });

export const fieldsForm = (fieldName, i18n) =>
  fromJS([
    FormSectionRecord({
      unique_id: "field_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("fields.name"),
          name: `${fieldName}.display_name.en`,
          type: TEXT_FIELD,
          required: true,
          help_text: i18n.t("fields.must_be_english"),
          hint: `${i18n.t("fields.db_name")}: ${fieldName}`
        }),
        FieldRecord({
          display_name: i18n.t("fields.help_text"),
          name: `${fieldName}.help_text.en`,
          type: TEXT_FIELD,
          help_text: i18n.t("fields.must_be_english")
        }),
        FieldRecord({
          display_name: i18n.t("fields.required"),
          name: `${fieldName}.required`,
          type: TICK_FIELD,
          required: true
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "field_form_options",
      name: i18n.t("fields.option_strings_text"),
      fields: [
        FieldRecord({
          display_name: i18n.t("fields.guiding_questions"),
          name: `${fieldName}.guiding_questions.en`,
          type: TEXT_FIELD,
          help_text: i18n.t("fields.must_be_english")
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "field_visibility",
      name: i18n.t("fields.visibility"),
      fields: [
        FieldRecord({
          display_name: i18n.t("fields.show_on"),
          name: `${fieldName}.show_on`,
          type: LABEL_FIELD
        }),
        {
          row: [
            FieldRecord({
              display_name: i18n.t("fields.web_app"),
              name: `${fieldName}.visible`,
              type: TICK_FIELD
            }),
            FieldRecord({
              display_name: i18n.t("fields.mobile_visible"),
              name: `${fieldName}.mobile_visible`,
              type: TICK_FIELD
            }),
            FieldRecord({
              display_name: i18n.t("fields.hide_on_view_page"),
              name: `${fieldName}.hide_on_view_page`,
              type: TICK_FIELD
            }),
            FieldRecord({
              display_name: i18n.t("fields.show_on_minify_form"),
              name: `${fieldName}.show_on_minify_form`,
              type: TICK_FIELD
            })
          ],
          equalColumns: false
        }
      ]
    })
  ]);
