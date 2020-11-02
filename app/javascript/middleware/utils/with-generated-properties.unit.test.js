import { stub } from "../../test";

import withGeneratedProperties from "./with-generated-properties";
import * as generateRecordProperties from "./generate-record-properties";

describe("middleware/utils/with-generated-properties.js", () => {
  it("build action with generated properties", () => {
    const action = { api: { path: "/", body: { record_action: "some_action" } } };
    const expected = { api: { path: "/", body: { data: { test: "hello" }, record_action: "some_action" } } };
    const generateRecordPropertiesStub = stub(generateRecordProperties, "default").returns({
      test: "hello"
    });

    expect(withGeneratedProperties(action, null)).to.deep.equal(expected);

    generateRecordPropertiesStub.restore();
  });
});
