// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Report /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "AGENCY_DISPLAY_NAME",
      "AGENCY",
      "BY_DISPLAY_NAME",
      "BY",
      "CONTROLS_GROUP",
      "CREATED_BY_GROUPS_DISPLAY_NAME",
      "CREATED_BY_GROUPS",
      "CREATED_ORGANIZATION",
      "CUSTOM",
      "DATE_CONTROLS_GROUP",
      "DATE_CONTROLS",
      "DATE_PATTERN",
      "DATE_RANGE_DISPLAY_NAME",
      "DATE_RANGE_FROM_DISPLAY_NAME",
      "DATE_RANGE_TO_DISPLAY_NAME",
      "DATE_RANGE_VIEW_BY_DISPLAY_NAME",
      "DATE_RANGE",
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
      "MONTH_OPTION_IDS",
      "MONTH",
      "NAME",
      "NAMESPACE",
      "OWNED_BY_AGENCY_ID",
      "OWNED_BY_GROUPS_DISPLAY_NAME",
      "OWNED_BY_GROUPS",
      "QUARTER_OPTION_IDS",
      "QUARTER",
      "RECORD_FILTERS",
      "REFERRAL_TRANSFER_STATUS",
      "REFERRAL_TRANSFER_STATUS_DISPLAY_NAME",
      "REPORTS",
      "SHARED_FILTERS",
      "STATUS_CLOSED",
      "STATUS_DISPLAY_NAME",
      "STATUS_OPEN",
      "STATUS",
      "THIS_MONTH",
      "THIS_QUARTER",
      "THIS_WEEK",
      "THIS_YEAR",
      "TOTAL_KEY",
      "TOTAL",
      "USER_GROUP_DISPLAY_NAME",
      "USER_GROUP",
      "VIOLATION",
      "VIOLATIONS_FILTERS",
      "VIOLENCE_TYPE",
      "VIOLENCE_TYPE_DISPLAY_NAME",
      "WEEK_OPTION_IDS",
      "WEEK",
      "WORKFLOW_DISPLAY_NAME",
      "WORKFLOW",
      "YEAR_OPTION_IDS",
      "YEAR",
      "PROTECTION_CONCERNS",
      "PROTECTION_CONCERNS_DISPLAY_NAME",
      "REPORTING_LOCATIONS",
      "REPORTING_LOCATIONS_DISPLAY_NAME",
      "FOLLOWUPS",
      "FOLLOWUPS_DISPLAY_NAME",
      "SERVICES",
      "SERVICES_DISPLAY_NAME",
      "SHARED_WORKFLOW_CONFIG",
      "MODULE_ID",
      "MODULE_ID_NAME"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });

  it("should have properties for INSIGHTS_CONFIG", () => {
    const clonedInsightsConfig = { ...constants.INSIGHTS_CONFIG };

    expect(Object.keys(clonedInsightsConfig)).toEqual([
      "violations",
      "ghn_report",
      "individual_children",
      "gbv_statistics",
      "protection_concerns_report",
      "reporting_locations_report",
      "followups_report",
      "services_report",
      "workflow_report",
      "cases_workflow_report",
      "violence_type_report",
      "referrals_transfers_report",
      "protection_outcomes",
      "process_quality_total_cases",
      "process_quality_average_cases",
      "process_quality_successful_referrals",
      "process_quality_implemented_referrals",
      "case_characteristics"
    ]);
  });
});
