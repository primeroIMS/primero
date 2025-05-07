// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { translateOptions } from "../../../../../test-utils";

import getSubformErrorMessages from "./get-subform-error-messages";

describe("getSubformErrorMessages", () => {
  it("should return an array of translated error messages", () => {
    const translations = {
      en: {
        "errors.models.form_section.unique_id": "The unique id '%{unique_id}' is already taken."
      }
    };
    const i18n = { t: (value, options) => translateOptions(value, options, translations) };
    const subformServerErrors = fromJS([
      {
        errors: [
          {
            status: 422,
            resource: "/api/v2/forms",
            detail: "unique_id",
            message: ["errors.models.form_section.unique_id"],
            value: "new_subform_1"
          },
          {
            status: 500,
            resource: "/api/v2/forms/1733",
            message: "Internal Server Error"
          }
        ]
      }
    ]);
    const expected = fromJS(["The unique id 'new_subform_1' is already taken.", "Internal Server Error"]);

    expect(getSubformErrorMessages(subformServerErrors, i18n)).toEqual(expected);
  });
});
