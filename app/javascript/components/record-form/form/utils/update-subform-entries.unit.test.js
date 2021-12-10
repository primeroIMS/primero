import { spy } from "../../../../test";

import updateSubformEntries from "./update-subform-entries";

describe("updateSubformEntries", () => {
  it("should execute arrayHelper and setFieldValue", () => {
    const formik = {
      values: {},
      setFieldValue: spy()
    };
    const values = [
      {
        name: "test"
      }
    ];

    formik.setFieldValue.calledWith(values);

    updateSubformEntries(formik, "testFieldName", 0, values, true);
  });
});
