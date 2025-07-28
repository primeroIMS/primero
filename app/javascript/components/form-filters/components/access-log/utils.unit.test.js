// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { getFilters } from "./utils";

describe("<RecordForms /> - utils", () => {
  describe("getFilters", () => {
    it("returns filters for access_logs form", () => {
      expect(getFilters(() => {}).map(filter => filter.name)).toEqual([
        "access_log.filters.actions",
        "access_log.filters.timestamp"
      ]);
    });
  });
});
