import { OPTION_TYPES } from "../../../form";

import { getOptionSources } from "./utils";

describe("ReportFiltersList - utils", () => {
  describe("getOptionSources()", () => {
    it("should return the sources defined for the fields", () => {
      const fields = [
        { name: "field_1", option_strings_source: OPTION_TYPES.LOCATION },
        { name: "field_2", option_strings_source: OPTION_TYPES.AGENCY },
        { name: "field_3", option_strings_source: OPTION_TYPES.MODULE },
        { name: "field_4", option_strings_source: OPTION_TYPES.FORM_GROUP }
      ];

      expect(getOptionSources(fields)).to.deep.equals({
        [OPTION_TYPES.LOCATION]: true,
        [OPTION_TYPES.AGENCY]: true,
        [OPTION_TYPES.MODULE]: true,
        [OPTION_TYPES.FORM_GROUP]: true
      });
    });
  });
});
