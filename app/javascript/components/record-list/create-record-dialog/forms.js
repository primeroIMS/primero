// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, TEXT_FIELD } from "../../form";

export const searchForm = (displayName, helpText) =>
  fromJS([
    FormSectionRecord({
      unique_id: "search_create",
      fields: [
        FieldRecord({
          display_name: displayName,
          name: "query",
          type: TEXT_FIELD,
          required: true,
          help_text: helpText
        })
      ]
    })
  ]);
