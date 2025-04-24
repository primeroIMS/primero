// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import recordMerge from "./record-merge";

describe("recordMerge", () => {
  it("merges the subforms of a record", () => {
    const prev = {
      id: 1,
      subform_section: [
        { unique_id: "uid-1", field: "value_1" },
        { unique_id: "uid-2", field: "value_2" }
      ]
    };
    const current = {
      id: 1,
      subform_section: [
        { unique_id: "uid-1", new_field: "new_value_1" },
        { unique_id: "uid-2", field: "value_2" }
      ]
    };

    expect(recordMerge(prev, current)).toEqual({
      id: 1,
      subform_section: [
        { unique_id: "uid-1", field: "value_1", new_field: "new_value_1" },
        { unique_id: "uid-2", field: "value_2" }
      ]
    });
  });

  it("overwrites the permitted_forms of a record", () => {
    const prev = {
      id: 1,
      permitted_forms: {
        form1: "rw",
        form2: "rw",
        form3: "rw"
      }
    };
    const current = {
      id: 1,
      permitted_forms: {
        form1: "rw",
        form2: "r"
      }
    };

    expect(recordMerge(prev, current)).toEqual({
      id: 1,
      permitted_forms: {
        form1: "rw",
        form2: "r"
      }
    });
  });
});
