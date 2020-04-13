import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../config/constants";
import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  SELECT_FIELD,
  TICK_FIELD,
  LABEL_FIELD
} from "../../../form";

// eslint-disable-next-line import/prefer-default-export
export const settingsForm = i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "agencies",
      name: i18n.t("forms.settings"),
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.title"),
          name: "name_en",
          type: TEXT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.must_be_english")
        }),
        FieldRecord({
          display_name: i18n.t("forms.description"),
          name: "description_en",
          type: TEXT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.summariaze_purpose")
        }),
        FieldRecord({
          display_name: i18n.t("forms.form_group"),
          name: "form_group_id",
          type: SELECT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.related_groups"),
          option_strings_source: "FormGroup",
          freeSolo: true
        }),
        [
          FieldRecord({
            display_name: i18n.t("forms.record_type"),
            name: "record_type",
            type: SELECT_FIELD,
            option_strings_text: Object.values(RECORD_TYPES).reduce(
              (results, item) => {
                if (item !== RECORD_TYPES.all) {
                  results.push({
                    id: item,
                    display_text: i18n.t(`forms.record_types.${item}`)
                  });
                }

                return results;
              },
              []
            ),
            required: true
          }),
          FieldRecord({
            display_name: i18n.t("forms.module"),
            name: "module",
            type: SELECT_FIELD,
            option_strings_source: "Module",
            required: true
          })
        ]
      ]
    }),
    FormSectionRecord({
      unique_id: "agencies",
      name: i18n.t("forms.visibility"),
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.show_on"),
          type: LABEL_FIELD
        }),
        [
          FieldRecord({
            display_name: i18n.t("forms.web_app"),
            name: "visible",
            type: TICK_FIELD
          }),
          FieldRecord({
            display_name: i18n.t("forms.show_page"),
            name: "title",
            type: TICK_FIELD
          }),
          FieldRecord({
            display_name: i18n.t("forms.short_form"),
            name: "title",
            type: TICK_FIELD
          })
        ]
      ]
    })
  ]);
