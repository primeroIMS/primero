/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

import { QUERY } from "./constants";

export const searchPromptForm = (css, i18n) =>
  fromJS([
    FormSectionRecord({
      unique_id: "search_create",
      fields: [
        FieldRecord({
          // display_name: i18n.t("case.enter_id_number"),
          name: QUERY,
          // help_text: "Why? To prevent creation of duplicate cases.",
          type: TEXT_FIELD,
          required: true,
          placeholder: "Search existing cases"
        })
      ]
    })
  ]);
