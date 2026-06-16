import { fromJS } from "immutable";

import { FormSectionRecord, FieldRecord, TEXT_FIELD } from "../../../../form";

export default i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "users",
      fields: [
        FieldRecord({
          display_name: i18n.t("user.password"),
          name: "password",
          type: TEXT_FIELD,
          password: true,
          hideOnShow: true
        }),
        FieldRecord({
          display_name: i18n.t("user.password_confirmation"),
          name: "password_confirmation",
          type: TEXT_FIELD,
          password: true,
          hideOnShow: true
        })
      ]
    })
  ]);
