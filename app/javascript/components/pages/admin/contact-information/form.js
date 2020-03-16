import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  TEXT_AREA
} from "../../../form";

export const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "contact_information",
      fields: [
        FieldRecord({
          display_name: i18n.t("contact.field.name"),
          name: "name",
          type: TEXT_FIELD,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.organization"),
          name: "organization",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.position"),
          name: "position",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.phone"),
          name: "phone",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.email"),
          name: "email",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.location"),
          name: "location",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.support_forum"),
          name: "support_forum",
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("contact.field.other_information"),
          name: "other_information",
          type: TEXT_AREA
        })
      ]
    })
  ]);
};
