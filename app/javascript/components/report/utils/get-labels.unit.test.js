// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { STRING_SOURCES_TYPES } from "../../../config";

import getLabels from "./get-labels";

describe("<Report /> - utils", () => {
  describe("getLabels", () => {
    it("returns the labels translated when all columns are present", () => {
      const data = {
        Row1: { Column1: { Total: 5 }, Column2: { Total: 2 }, Total: 7 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 1 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const fields = [];

      expect(getLabels(data, i18n, fields, {})).toEqual(["Row1", "Row2"]);
    });

    it("returns the labels translated when some columns are not present", () => {
      const data = {
        Row1: { Column1: { Total: 5 }, Total: 5 },
        Row2: { Column2: { Total: 5 }, Total: 5 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const fields = [];

      expect(getLabels(data, i18n, fields, {})).toEqual(["Row1", "Row2"]);
    });

    it("returns the labels for the agencies even when there are more than 2 rows defined", () => {
      const data = {
        agency1: { Row1: { Column1: { Total: 5 } }, Total: 5 },
        agency2: { Row2: { Column2: { Total: 5 } }, Total: 5 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const fields = [{ option_strings_source: STRING_SOURCES_TYPES.AGENCY, position: { type: "horizontal" } }];

      expect(
        getLabels(data, i18n, fields, {
          agencies: [
            { id: "agency1", display_text: "Agency 1" },
            { id: "agency2", display_text: "Agency 2" }
          ]
        })
      ).toEqual(["Agency 1", "Agency 2"]);
    });
  });
});
