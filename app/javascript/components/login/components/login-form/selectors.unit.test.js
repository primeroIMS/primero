// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { selectModules, selectAgency, selectAuthErrors } from "./selectors";

const stateWithNoRecords = fromJS({});
const stateWithRecords = fromJS({
  user: {
    modules: ["primeromodule-cp", "primeromodule-gbv"],
    agency: "unicef",
    isAuthenticated: true,
    messages: null
  }
});

describe("<LoginForm /> - Selectors", () => {
  describe("selectModules", () => {
    it("should return records", () => {
      const records = selectModules(stateWithRecords);

      expect(records).toEqual(fromJS(["primeromodule-cp", "primeromodule-gbv"]));
    });

    it("should return empty object when records empty", () => {
      const records = selectModules(stateWithNoRecords);

      expect(records).toBeUndefined();
    });
  });

  describe("selectAgency", () => {
    it("should return records", () => {
      const records = selectAgency(stateWithRecords);

      expect(records).toEqual("unicef");
    });

    it("should return empty object when records empty", () => {
      const records = selectAgency(stateWithNoRecords);

      expect(records).toBeUndefined();
    });
  });

  describe("selectAuthErrors", () => {
    it("should return records meta", () => {
      const meta = selectAuthErrors(stateWithRecords);

      expect(meta).toEqual("");
    });

    it("should return empty object when records empty", () => {
      const meta = selectAuthErrors(stateWithNoRecords);

      expect(meta).toEqual("");
    });
  });
});
