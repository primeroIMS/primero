import { spy } from "../../../../test";

import addSubformEntries from "./add-subform-entries";

describe("addSubformEntries", () => {
  it("should execute arrayHelper and setFieldValue", () => {
    const formik = {
      values: {},
      setFieldValue: spy()
    };
    const arrayHelpers = {
      push: spy()
    };
    const values = [
      {
        name: "test"
      }
    ];

    arrayHelpers.push.calledWith(values);
    formik.setFieldValue.calledWith(values);

    addSubformEntries(formik, arrayHelpers, values, true);
  });
});
