/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../form";

export const searchForm = i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "search_create",
      fields: [
        FieldRecord({
          display_name: i18n.t("case.enter_id_number"),
          name: "query",
          type: TEXT_FIELD,
          required: true
        })
      ]
    })
  ]);
