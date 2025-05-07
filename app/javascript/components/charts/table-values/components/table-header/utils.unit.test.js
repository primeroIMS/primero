// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { emptyColumn } from "./utils";

describe("<TableValues/> - components/utils", () => {
  describe("emptyColumn", () => {
    const i18n = {
      t: value => value
    };

    describe("when withoutTotal is false", () => {
      const result = emptyColumn(i18n);

      it("returns an array of two elements", () => {
        expect(result).toHaveLength(2);
      });
      it("returns the last element with total label", () => {
        expect(result[1]).toBe("report.total");
      });
    });

    describe("when withoutTotal is true", () => {
      it("returns an array with a single and empty element", () => {
        const result = emptyColumn(i18n, true);

        expect(result[0]).toHaveLength(0);
        expect(result).toHaveLength(1);
      });
    });
  });
});
