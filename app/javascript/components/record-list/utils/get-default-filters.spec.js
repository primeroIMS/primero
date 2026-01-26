// Copyright (c) 2014 - 2026 UNICEF. All rights reserved.
import { fromJS } from "immutable";

import getDefaultFilters from "./get-default-filters";

describe("getDefaultFilters", () => {
  const metadata = fromJS({ total: 100, per: 20, page: 1 });

  describe("when user has multiple modules", () => {
    const modules = fromJS([
      { unique_id: "primeromodule-cp", name: "CP" },
      { unique_id: "primeromodule-gbv", name: "GBV" }
    ]);
    const userModules = fromJS([
      { unique_id: "primeromodule-cp", name: "CP" },
      { unique_id: "primeromodule-gbv", name: "GBV" }
    ]);

    it("returns default filters with module_id array", () => {
      const result = getDefaultFilters({
        queryParams: {},
        metadata,
        modules,
        userModules
      });

      expect(result.get("fields")).toEqual("short");
      expect(result.get("status").toJS()).toEqual(["open"]);
      expect(result.get("record_state").toJS()).toEqual(["true"]);
      expect(result.get("module_id").toJS()).toEqual(["primeromodule-cp", "primeromodule-gbv"]);
    });

    it("merges metadata with default filters", () => {
      const result = getDefaultFilters({
        queryParams: {},
        metadata,
        modules,
        userModules
      });

      expect(result.get("total")).toEqual(100);
      expect(result.get("per")).toEqual(20);
      expect(result.get("page")).toEqual(1);
    });
  });

  describe("when user has single module", () => {
    const modules = fromJS([{ unique_id: "primeromodule-cp", name: "CP" }]);
    const userModules = fromJS([{ unique_id: "primeromodule-cp", name: "CP" }]);

    it("returns default filters without module_id", () => {
      const result = getDefaultFilters({
        queryParams: {},
        metadata,
        modules,
        userModules
      });

      expect(result.get("fields")).toEqual("short");
      expect(result.get("status").toJS()).toEqual(["open"]);
      expect(result.get("record_state").toJS()).toEqual(["true"]);
      expect(result.get("module_id")).toBeUndefined();
    });

    it("merges metadata with default filters", () => {
      const result = getDefaultFilters({
        queryParams: {},
        metadata,
        modules,
        userModules
      });

      expect(result.get("total")).toEqual(100);
      expect(result.get("per")).toEqual(20);
      expect(result.get("page")).toEqual(1);
    });
  });

  describe("when queryParams are provided", () => {
    const modules = fromJS([
      { unique_id: "primeromodule-cp", name: "CP" },
      { unique_id: "primeromodule-gbv", name: "GBV" }
    ]);
    const userModules = fromJS([
      { unique_id: "primeromodule-cp", name: "CP" },
      { unique_id: "primeromodule-gbv", name: "GBV" }
    ]);

    it("uses queryParams instead of default filters", () => {
      const queryParams = {
        status: ["closed"],
        fields: "full",
        custom_filter: "value"
      };
      const result = getDefaultFilters({
        queryParams,
        metadata,
        modules,
        userModules
      });

      expect(result.get("status").toJS()).toEqual(["closed"]);
      expect(result.get("fields")).toEqual("full");
      expect(result.get("custom_filter")).toEqual("value");
    });

    it("merges metadata with queryParams", () => {
      const queryParams = { status: ["closed"] };
      const result = getDefaultFilters({
        queryParams,
        metadata,
        modules,
        userModules
      });

      expect(result.get("total")).toEqual(100);
      expect(result.get("per")).toEqual(20);
      expect(result.get("page")).toEqual(1);
    });
  });

  describe("when modules is undefined", () => {
    it("returns default filters without module_id", () => {
      const result = getDefaultFilters({
        queryParams: {},
        metadata,
        modules: undefined,
        userModules: undefined
      });

      expect(result.get("fields")).toEqual("short");
      expect(result.get("status").toJS()).toEqual(["open"]);
      expect(result.get("record_state").toJS()).toEqual(["true"]);
      expect(result.get("module_id")).toBeUndefined();
    });
  });
});
