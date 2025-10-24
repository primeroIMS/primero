// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const NAME = "InsightsSubReport";
export const COMBINED_INDICATORS = {
  incidents: ["total", "gbv_previous_incidents"]
};
export const GROUPED_BY_FILTER = "grouped_by";
export const GHN_VIOLATIONS_INDICATORS_IDS = [
  "verified_information_violations",
  "late_verification_violations",
  "unverified_information_violations"
];
export const REPORTING_LOCATION_INSIGHTS = [
  "reporting_location",
  "reporting_location_detention",
  "reporting_location_denial"
];

export const PERCENTAGE_INDICATORS = [
  "improved_wellbeing_after_support",
  "less_impacted_after_support",
  "percentage_successful_referrals",
  "percentage_cases_protection_risk",
  "percentage_cases_risk_level",
  "percentage_cases_duration",
  "percentage_clients_with_disability",
  "percentage_cases_safety_plan",
  "percentage_clients_gender",
  "percentage_case_reasons_for_closure"
];

export const HEADER_TITLE_KEYS = Object.freeze({
  gbv_statistics: {
    sex: "managed_reports.gbv_statistics.header_title.sex",
    age: "managed_reports.gbv_statistics.header_title.age",
    marital_status: "managed_reports.gbv_statistics.header_title.marital_status",
    displacement_status: "managed_reports.gbv_statistics.header_title.displacement_status",
    displacement_incident: "managed_reports.gbv_statistics.header_title.displacement_incident",
    gbv_sexual_violence_type: "managed_reports.gbv_statistics.header_title.gbv_sexual_violence_type",
    incident_timeofday: "managed_reports.gbv_statistics.header_title.incident_timeofday",
    incident_location_type: "managed_reports.gbv_statistics.header_title.incident_location_type",
    perpetrator_relationship: "managed_reports.gbv_statistics.header_title.perpetrator_relationship",
    perpetrator_age_group: "managed_reports.gbv_statistics.header_title.perpetrator_age_group",
    perpetrator_occupation: "managed_reports.gbv_statistics.header_title.perpetrator_occupation"
  }
});
