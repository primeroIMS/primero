// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { PrimeroModuleRecord } from "../application/records";

import { getModuleLogoID } from "./selectors";

describe("getModuleLogoID", () => {
  it("should return the first user module", () => {
    const testModule = PrimeroModuleRecord({
      unique_id: "test-1",
      name: "Test 1"
    });
    const state = fromJS({
      application: {
        modules: [testModule]
      },
      user: {
        modules: ["test-1"]
      }
    });
    const result = getModuleLogoID(state);
    const expected = "test-1";

    expect(result).toEqual(expected);
  });

  it("should return primero if no user module", () => {
    const state = fromJS({});
    const expected = "primero";

    expect(getModuleLogoID(state)).toEqual(expected);
  });
});
