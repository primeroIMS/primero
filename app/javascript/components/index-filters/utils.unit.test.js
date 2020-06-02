import { APPROVALS, APPROVALS_TYPES } from "../../config";

import { compactFilters, buildNameFilter } from "./utils";

describe("<IndexFilters /> - Utils", () => {
  describe("compactFilters()", () => {
    it("returns compacted object", () => {
      const expected = {
        filter2: true,
        filter4: ["open"],
        filter6: { option1: "option1" }
      };

      const values = {
        filter1: false,
        filter2: true,
        filter3: [],
        filter4: ["open"],
        filter5: {},
        filter6: { option1: "option1" }
      };

      expect(compactFilters(values)).to.deep.equal(expected);
    });
  });

  describe("buildNameFilter", () => {
    const i18n = { t: item => item };
    const approvalsLabels = {
      assessment: "Assessment"
    };

    it("return the item if it is not an approval", () => {
      const item = "filter.referred_cases";

      expect(buildNameFilter(item, i18n, approvalsLabels)).to.deep.equal(item);
    });

    it("return approval label filter if it's an approval", () => {
      const item = `${APPROVALS}.${APPROVALS_TYPES.assessment}`;

      expect(buildNameFilter(item, i18n, approvalsLabels)).to.deep.equal(
        approvalsLabels.assessment
      );
    });
  });
});
