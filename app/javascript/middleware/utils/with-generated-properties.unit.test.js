import { stub } from "../../test";

import withGeneratedProperties from "./with-generated-properties";
import * as generateRecordProperties from "./generate-record-properties";

describe("middleware/utils/with-generated-properties.js", () => {
  it("build action with generated properties", () => {
    const action = { api: { path: "/" } };
    const expected = { api: { path: "/", body: { data: { test: "hello" } } } };
    const generateRecordPropertiesStub = stub(
      generateRecordProperties,
      "default"
    ).returns({
      test: "hello"
    });

    expect(withGeneratedProperties(action, null)).to.deep.equal(expected);

    generateRecordPropertiesStub.restore();
  });
});
