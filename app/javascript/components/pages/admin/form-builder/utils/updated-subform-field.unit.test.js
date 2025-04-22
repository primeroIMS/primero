// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import updateSubformField from "./update-subform-field";

describe("updateSubformField", () => {
  it("merges the subform field data", () => {
    const field = fromJS({
      name: "field_1",
      display_name: "Field 1",
      option_strings_text: [{ id: "1", display_text: "Opcion 1" }]
    });
    const fieldUpdate = fromJS({
      name: "field_1",
      display_name: "Updated Field 1",
      option_strings_text: [
        { id: "1", display_text: "Opcion 1" },
        { id: "2", display_text: "Opcion 2" }
      ]
    });

    expect(updateSubformField(field, fieldUpdate)).toEqual(fieldUpdate);
  });
});
