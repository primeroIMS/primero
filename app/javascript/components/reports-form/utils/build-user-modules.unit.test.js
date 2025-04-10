// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildUserModules from "./build-user-modules";

describe("<ReportForm>/utils/buildUserModules()", () => {
  it("should return a list of formatted objects", () => {
    const modules = fromJS([{ name: "test", unique_id: "test-1" }]);
    const expected = [{ id: "test-1", display_text: "test" }];

    expect(buildUserModules(modules)).toEqual(expected);
  });

  it("should return an empty array", () => {
    expect(buildUserModules(fromJS([]))).toHaveLength(0);
  });
});
