// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { APPROVALS, APPROVALS_TYPES } from "../../../config";
import useSystemStrings from "../../application/use-system-strings";
import { setupHook } from "../../../test-utils";
import { useApp } from "../../application";

import buildNameFilter from "./build-name-filter";

jest.mock("../../application/use-app");

describe("<IndexFilters>/utils - buildNameFilter", () => {
  const i18n = { t: item => item };
  const approvalsLabels = fromJS({
    assessment: "Assessment",
    gbv_closure: "GBV Closure"
  });

  beforeEach(() => {
    useApp.mockReturnValue({
      fieldLabels: fromJS({
        name: {
          en: "Name (from SYS Settings)"
        },

        "dashboard.case_risk": {
          en: "Risk Level (from SYS Settings)"
        }
      })
    });
  });

  it("return the item if it is not an approval", () => {
    const item = "filter.referred_cases";
    const { result } = setupHook(() => useSystemStrings("listHeader"));

    expect(buildNameFilter(item, i18n, result.current.label, approvalsLabels)).toEqual(item);
  });

  it("return approval label filter if it's an approval", () => {
    const item = `${APPROVALS}.${APPROVALS_TYPES.assessment}`;
    const { result } = setupHook(() => useSystemStrings("listHeader"));

    expect(buildNameFilter(item, i18n, result.current.label, approvalsLabels)).toEqual(
      approvalsLabels.getIn(["default", "assessment"])
    );
  });

  it("return approval label filter if it's an GBV approval", () => {
    const item = `${APPROVALS}.${APPROVALS_TYPES.gbv_closure}`;
    const { result } = setupHook(() => useSystemStrings("listHeader"));

    expect(buildNameFilter(item, i18n, result.current.label, approvalsLabels)).toEqual(
      approvalsLabels.getIn(["default", "gbv_closure"])
    );
  });
});
