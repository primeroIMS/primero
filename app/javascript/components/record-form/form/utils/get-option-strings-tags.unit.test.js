// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FieldRecord } from "../../records";
import { SELECT_FIELD } from "../../constants";

import getOptionStringsTags from "./get-option-strings-tags";

describe("getOptionStringsTags", () => {
  const field = FieldRecord({
    name: "conditioned_select",
    type: SELECT_FIELD,
    option_strings_condition: {
      tag1: { eq: { key1: "value1" } }
    }
  });

  it("returns the tags for the field", () => {
    expect(getOptionStringsTags(field, { key1: "value1" })).toEqual(["tag1"]);
  });
});
