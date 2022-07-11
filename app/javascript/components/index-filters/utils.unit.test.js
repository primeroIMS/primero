import { fromJS } from "immutable";

import { APPROVALS, APPROVALS_TYPES } from "../../config";

import { compactFilters, buildNameFilter, combineFilters, splitFilters } from "./utils";

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
    const approvalsLabels = fromJS({
      assessment: "Assessment",
      gbv_closure: "GBV Closure"
    });

    it("return the item if it is not an approval", () => {
      const item = "filter.referred_cases";

      expect(buildNameFilter(item, i18n, approvalsLabels)).to.deep.equal(item);
    });

    it("return approval label filter if it's an approval", () => {
      const item = `${APPROVALS}.${APPROVALS_TYPES.assessment}`;

      expect(buildNameFilter(item, i18n, approvalsLabels)).to.deep.equal(approvalsLabels.get("assessment"));
    });

    it("return approval label filter if it's an GBV approval", () => {
      const item = `${APPROVALS}.${APPROVALS_TYPES.gbv_closure}`;

      expect(buildNameFilter(item, i18n, approvalsLabels)).to.deep.equal(approvalsLabels.get("gbv_closure"));
    });
  });

  describe("combineFilters", () => {
    it("combines violation_category and verification_status if both are present", () => {
      const data = {
        record_state: ["true"],
        violation_category: ["killing", "maiming"],
        verification_status: ["verified", "report_pending_verification"]
      };

      const expected = {
        record_state: ["true"],
        violation_with_verification_status: [
          "killing_verified",
          "killing_report_pending_verification",
          "maiming_verified",
          "maiming_report_pending_verification"
        ]
      };

      expect(combineFilters(data)).to.deep.equal(expected);
    });

    it("does not combines violation_category and verification_status if only violation_category is present", () => {
      const data = {
        record_state: ["true"],
        violation_category: ["killing", "maiming"]
      };

      expect(combineFilters(data)).to.deep.equal(data);
    });

    it("does not combines violation_category and verification_status if only verification_status is present", () => {
      const data = {
        record_state: ["true"],
        verification_status: ["verified", "report_pending_verification"]
      };

      expect(combineFilters(data)).to.deep.equal(data);
    });
  });

  describe("splitFilters", () => {
    it("splits the violation_category and verification_status if both are present", () => {
      const data = {
        record_state: ["true"],
        violation_with_verification_status: [
          "killing_verified",
          "killing_report_pending_verification",
          "maiming_verified",
          "maiming_report_pending_verification"
        ]
      };

      const expected = {
        record_state: ["true"],
        violation_category: ["killing", "maiming"],
        verification_status: ["verified", "report_pending_verification"]
      };

      expect(splitFilters(data)).to.deep.equal(expected);
    });

    it("does not split the violation_category and verification_status if only violation_category is present", () => {
      const data = {
        record_state: ["true"],
        violation_category: ["killing", "maiming"]
      };

      expect(splitFilters(data)).to.deep.equal(data);
    });

    it("does not split the violation_category and verification_status if only verification_status is present", () => {
      const data = {
        record_state: ["true"],
        verification_status: ["verified", "report_pending_verification"]
      };

      expect(splitFilters(data)).to.deep.equal(data);
    });
  });
});
