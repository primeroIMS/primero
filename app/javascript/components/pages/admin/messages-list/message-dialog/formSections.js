import { fromJS } from "immutable";
import { FieldRecord, FormSectionRecord, TEXT_AREA, TEXT_FIELD } from "../../../../form";

const form = i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "message",
      fields: [
        FieldRecord({
            name: "recipient",
            display_name: i18n.t("messages.attribute.recipient"),
            required: true,
            autoFocus: true,
            type: TEXT_FIELD
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
