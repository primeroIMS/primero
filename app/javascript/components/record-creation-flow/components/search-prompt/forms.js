/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../../form";

import { QUERY } from "./constants";

export const searchPromptForm = i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "search_create",
      fields: [
        FieldRecord({
          name: QUERY,
          type: TEXT_FIELD,
          required: true,
          placeholder: i18n.t("case.search_existing")
        })
      ]
    })
  ]);
