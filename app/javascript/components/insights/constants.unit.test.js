import { expect } from "chai";

import { MODULES } from "../../config/constants";

import * as constants from "./constants";

describe("<Report /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "CONTROLS_GROUP",
      "CUSTOM",
      "DATE_CONTROLS",
      "DATE_CONTROLS_GROUP",
      "DATE_PATTERN",
      "DELETE_MODAL",
      "EXPORT_INSIGHTS_PATH",
      "INSIGHTS_CONFIG",
      "INSIGHTS_EXPORTER_DIALOG",
      "LAST_MONTH",
      "LAST_QUARTER",
      "LAST_YEAR",
      "MANAGED_REPORTS",
      "MONTH",
      "MONTH_OPTION_IDS",
      "NAME",
      "NAMESPACE",
      "QUARTER",
      "QUARTER_OPTION_IDS",
      "SHARED_FILTERS",
      "THIS_MONTH",
      "THIS_QUARTER",
      "THIS_YEAR",
      "TOTAL",
      "TOTAL_KEY",
      "VIOLATION",
      "YEAR",
      "YEAR_OPTION_IDS",
      "DATE_RANGE_VIEW_BY_DISPLAY_NAME",
      "DATE_RANGE_DISPLAY_NAME",
      "DATE_RANGE_FROM_DISPLAY_NAME",
      "DATE_RANGE_TO_DISPLAY_NAME",
      "FILTER_BY_DATE_DISPLAY_NAME",
      "FILTER_BY_VERIFICATION_STATUS_DISPLAY_NAME",
      "DATE_RANGE",
      "GROUPED_BY",
      "REPORTS",
      "DEFAULT_VIOLATION_FILTERS",
      "FILTER_BY_VIOLATION_TYPE_DISPLAY_NAME",
      "VIOLATIONS_FILTERS",
      "WEEK",
      "STATUS",
      "STATUS_CLOSED",
      "STATUS_OPEN",
      "CREATED_BY_GROUPS",
      "OWNED_BY_GROUPS",
      "USER_GROUP",
      "USER_GROUPS_FIELD",
      "THIS_WEEK",
      "LAST_WEEK",
      "WEEK_OPTION_IDS",
      "STATUS_DISPLAY_NAME",
      "CREATED_BY_GROUPS_DISPLAY_NAME",
      "OWNED_BY_GROUPS_DISPLAY_NAME",
      "USER_GROUPS_FIELD_DISPLAY_NAME",
      "USER_GROUP_DISPLAY_NAME",
      "WORKFLOW_DISPLAY_NAME",
      "WORKFLOW"
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
