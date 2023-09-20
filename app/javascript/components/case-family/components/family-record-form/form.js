import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, LINK_FIELD, TEXT_FIELD } from "../../../form";
import { FAMILY_ID_DISPLAY, FAMILY_NAME, FAMILY_NUMBER } from "../../constants";
import { RESOURCES } from "../../../permissions";

export default (i18n, familyId) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "family_record",
      fields: [
        FieldRecord({
          display_name: i18n.t("families.family_id"),
          name: FAMILY_ID_DISPLAY,
          type: LINK_FIELD,
          href: `/${RESOURCES.families}/${familyId}`
        }),
        FieldRecord({
          display_name: i18n.t("families.family_number"),
          name: FAMILY_NUMBER,
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("families.family_name"),
          name: FAMILY_NAME,
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
