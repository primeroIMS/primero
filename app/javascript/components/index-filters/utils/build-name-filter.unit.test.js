import { fromJS } from "immutable";

import { APPROVALS, APPROVALS_TYPES } from "../../../config";

import buildNameFilter from "./build-name-filter";

describe("<IndexFilters>/utils - buildNameFilter", () => {
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
