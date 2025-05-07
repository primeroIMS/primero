// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import addSubformEntries from "./add-subform-entries";

describe("addSubformEntries", () => {
  it("should execute arrayHelper and setFieldValue", () => {
    const formik = {
      values: { sources: [] },
      setFieldValue: jest.fn()
    };
    const arrayHelpers = {
      push: jest.fn()
    };
    const values = {
      sources: [{ test: "test" }]
    };

    addSubformEntries(formik, arrayHelpers, values, true);

    expect(arrayHelpers.push).toHaveBeenCalledWith({});
    expect(formik.setFieldValue).toHaveBeenCalledWith("sources", values.sources, false);
  });
});
