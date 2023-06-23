import { expect } from "chai";

import { MODULES } from "../../config/constants";

import * as constants from "./constants";

describe("<Report /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "AGENCY",
      "AGENCY_DISPLAY_NAME",
      "BY",
      "BY_DISPLAY_NAME",
      "CONTROLS_GROUP",
      "CREATED_BY_GROUPS",
      "CREATED_BY_GROUPS_DISPLAY_NAME",
      "CREATED_ORGANIZATION",
      "CUSTOM",
      "DATE_CONTROLS",
      "DATE_CONTROLS_GROUP",
      "DATE_PATTERN",
      "DATE_RANGE",
      "DATE_RANGE_DISPLAY_NAME",
      "DATE_RANGE_FROM_DISPLAY_NAME",
      "DATE_RANGE_TO_DISPLAY_NAME",
      "DATE_RANGE_VIEW_BY_DISPLAY_NAME",
      "DEFAULT_VIOLATION_FILTERS",
      "DELETE_MODAL",
      "EXPORT_INSIGHTS_PATH",
      "FILTER_BY_DATE_DISPLAY_NAME",
      "FILTER_BY_VERIFICATION_STATUS_DISPLAY_NAME",
      "FILTER_BY_VIOLATION_TYPE_DISPLAY_NAME",
      "GROUPED_BY",
      "INSIGHTS_CONFIG",
      "INSIGHTS_EXPORTER_DIALOG",
      "LAST_MONTH",
      "LAST_QUARTER",
      "LAST_WEEK",
      "LAST_YEAR",
      "MANAGED_REPORTS",
      "MONTH",
      "MONTH_OPTION_IDS",
      "NAME",
      "NAMESPACE",
      "OWNED_BY_AGENCY_ID",
      "OWNED_BY_GROUPS",
      "OWNED_BY_GROUPS_DISPLAY_NAME",
      "QUARTER",
      "QUARTER_OPTION_IDS",
      "REPORTS",
      "SHARED_FILTERS",
      "STATUS",
      "STATUS_CLOSED",
      "STATUS_DISPLAY_NAME",
      "STATUS_OPEN",
      "THIS_MONTH",
      "THIS_QUARTER",
      "THIS_WEEK",
      "THIS_YEAR",
      "TOTAL",
      "TOTAL_KEY",
      "USER_GROUP",
      "USER_GROUP_DISPLAY_NAME",
      "VIOLATION",
      "VIOLATIONS_FILTERS",
      "WEEK",
      "WEEK_OPTION_IDS",
      "WORKFLOW",
      "WORKFLOW_DISPLAY_NAME",
      "YEAR",
      "YEAR_OPTION_IDS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });

  it("should have properties for INSIGHTS_CONFIG", () => {
    const clonedInsightsConfig = { ...constants.INSIGHTS_CONFIG };
    const expectModuleKeys = [MODULES.MRM, MODULES.GBV, MODULES.CP];

    expect(Object.keys(clonedInsightsConfig)).to.eql(expectModuleKeys);
    expect(Object.keys(clonedInsightsConfig[MODULES.MRM])).to.eql(["violations", "ghn_report", "individual_children"]);
    expect(Object.keys(clonedInsightsConfig[MODULES.GBV])).to.eql(["gbv_statistics"]);
  });
});
