// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { getFilters } from "./utils";

describe("<RecordForms /> - utils", () => {
  describe("getFilters", () => {
    it("returns filters for access_logs form", () => {
      const i18n = { t: t => t };

      expect(getFilters(i18n).map(filter => filter.name)).toEqual([
        "access_log.filters.actions",
        "access_log.filters.timestamp"
      ]);
    });
  });
});
