// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import withGeneratedProperties from "./with-generated-properties";
import * as generateRecordProperties from "./generate-record-properties";

jest.mock("./generate-record-properties", () => {
  const originalModule = jest.requireActual("./generate-record-properties");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("middleware/utils/with-generated-properties.js", () => {
  it("build action with generated properties", () => {
    const action = { api: { path: "/", body: { record_action: "some_action" } } };
    const expected = { api: { path: "/", body: { data: { test: "hello" }, record_action: "some_action" } } };

    jest.spyOn(generateRecordProperties, "default").mockReturnValue({
      test: "hello"
    });

    expect(withGeneratedProperties(action, null)).toEqual(expected);

    jest.resetAllMocks();
  });
});
