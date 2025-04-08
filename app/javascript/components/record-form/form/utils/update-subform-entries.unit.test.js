// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import updateSubformEntries from "./update-subform-entries";

describe("updateSubformEntries", () => {
  it("should execute arrayHelper and setFieldValue", () => {
    const formik = {
      values: {},
      setFieldValue: jest.fn()
    };
    const values = {
      name: "test"
    };

    updateSubformEntries(formik, "testFieldName", 0, values, true);

    expect(formik.setFieldValue).toHaveBeenCalledWith("testFieldName[0]", values, false);
  });

  it("does not omit blank values if it is not a violation", () => {
    const formik = {
      values: { name: "test" },
      setFieldValue: jest.fn()
    };
    const values = {
      name: ""
    };

    updateSubformEntries(formik, "testFieldName", 0, values, false);

    expect(formik.setFieldValue).toHaveBeenCalledWith("testFieldName[0]", values, false);
  });
});
