import { fromJS } from "immutable";
import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD, TEXT_AREA, TEXT_FIELD } from "../../../../form";

const form = i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "message",
      fields: [
        FieldRecord({
            name: "recipient_groups",
            display_name: i18n.t("messages.attribute.recipient_groups"),
            required: true,
            autoFocus: true,
            type: SELECT_FIELD,
            multi_select: true,
            option_strings_source: OPTION_TYPES.USER_GROUP
        }),
        FieldRecord({
          name: "body",
          display_name: i18n.t("rp_messages.attributes.body"),
          required: true,
          type: TEXT_AREA
        })
      ]
    })
  ]);
export default form;
