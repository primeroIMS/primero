// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as configConstants from "./config";

describe("Verifying config constant", () => {
  it("exports an object", () => {
    expect(typeof configConstants).toEqual("object");
  });

  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...configConstants };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "API_BASE_PATH",
      "ACCEPT",
      "ACCEPTED",
      "ADMIN_NAV",
      "AGE_MAX",
      "ALERTS_FOR",
      "API_DATE_FORMAT",
      "API_DATE_TIME_FORMAT",
      "APPLICATION_NAV",
      "APPROVALS",
      "APPROVALS_TYPES",
      "CASE",
      "CASES",
      "CASE_RELATIONSHIPS",
      "CHANGE_LOGS",
      "CODE_FIELD",
      "CODE_OF_CONDUCT_DATE_FORMAT",
      "CONSENT_GIVEN_FIELD_BY_MODULE",
      "DATE_SORTABLE_FIELDS",
      "DATABASE_NAME",
      "DATE_FORMAT",
      "DATE_FORMAT_NE",
      "DATE_TIME_FORMAT",
      "DEFAULT_DATE_VALUES",
      "DEFAULT_METADATA",
      "DISPLAY_TEXT_FIELD",
      "DONE",
      "FAMILIES",
      "FAMILY",
      "FAMILY_DETAILS_SUBFORM_ID",
      "FAMILY_MEMBERS_SUBFORM_ID",
      "FETCH_PARAM",
      "FETCH_TIMEOUT",
      "FILE_FORMAT",
      "FORM_PERMISSION_ACTION",
      "HTTP_STATUS",
      "IDLE_LOGOUT_TIMEOUT",
      "IDLE_TIMEOUT",
      "ID_FIELD",
      "FAMILY_FROM_CASE",
      "INCIDENT",
      "INCIDENTS",
      "INCIDENT_CASE_ID_DISPLAY_FIELD",
      "INCIDENT_CASE_ID_FIELD",
      "INCIDENT_FROM_CASE",
      "INCIDENT_SHORT_ID_FIELD",
      "INCIDENT_TRANSFERS_ASSIGNMENTS",
      "INPROGRESS",
      "ISO_DATE_REGEX",
      "ISO_DATE_TIME_REGEX",
      "LOCALE_KEYS",
      "LOCATION_PATH",
      "LOOKUPS",
      "MATCH_VALUES",
      "MAX_ATTACHMENT_SIZE",
      "MAX_CONDITIONS",
      "MAX_IMAGE_SIZE",
      "MAX_OFFLINE_ROWS_PER_PAGE",
      "METHODS",
      "MODES",
      "MODULES",
      "MODULE_TYPE_FIELD",
      "MONTH_AND_YEAR_FORMAT",
      "MRM_INSIGHTS_SUBREPORTS",
      "NAME_FIELD",
      "OFFLINE_ROWS_PER_PAGE_OPTIONS",
      "PASSWORD_MIN_LENGTH",
      "PERMITTED_URL",
      "POTENTIAL_MATCH_LIKELIHOOD",
      "PROCESS_QUALITY_AVERAGE_CASES_SUBREPORTS",
      "PROCESS_QUALITY_TOTAL_CASES_SUBREPORTS",
      "RECORD_INFORMATION",
      "RECORD_INFORMATION_GROUP",
      "IDENTIFICATION_REGISTRATION",
      "RECORD_OWNER",
      "RECORD_PATH",
      "RECORD_TYPES",
      "RECORD_TYPES_PLURAL",
      "REFERRAL",
      "REFERRAL_TRANSFERS_SUBREPORTS",
      "REGISTRY_RECORD",
      "REGISTRY_RECORDS",
      "REJECT",
      "REJECTED",
      "REVOKED",
      "ROUTES",
      "ROWS_PER_PAGE_OPTIONS",
      "SAVE_METHODS",
      "SAVING",
      "SERVICES_SUBFORM_FIELD",
      "STRING_SOURCES_TYPES",
      "SUBFORM_READONLY_FIELD_NAMES",
      "SUMMARY",
      "WORKFLOW_SUBREPORTS",
      "CASES_WORKFLOW_SUBREPORTS",
      "TOKEN_REFRESH_INTERVAL",
      "TRACES_SUBFORM_UNIQUE_ID",
      "TRACING_REQUEST",
      "TRACING_REQUESTS",
      "TRACING_REQUEST_STATUS_FIELD_NAME",
      "TRANSFERS_ASSIGNMENTS",
      "TRANSITIONS_DATE_FORMAT",
      "TRANSITION_TYPE",
      "UNIQUE_ID_FIELD",
      "USER_NAME_FIELD",
      "VIOLATIONS_ASSOCIATIONS_FORM",
      "VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS",
      "VIOLATIONS_FORM",
      "VIOLATIONS_SUBFORM_UNIQUE_IDS",
      "VIOLATION_GROUP",
      "VIOLATION_VERIFICATION_STATUS",
      "VIOLATION_TYPE",
      "VIOLENCE_TYPE_SUBREPORTS",
      "GBV_INSIGHTS_SUBREPORTS",
      "CHART_COLORS",
      "REGISTRY_FROM_CASE",
      "QUARTERS",
      "QUARTERS_TO_NUMBER",
      "QUICK_SEARCH_FIELDS",
      "Q1",
      "Q2",
      "Q3",
      "Q4",
      "GHN_REPORT_SUBREPORTS",
      "SUMMARY_INCIDENT_MRM",
      "VIOLATION_FORMS_MAPPING",
      "VIOLATIONS_ASSOCIATIONS_RESPONSES",
      "INDIVIDUAL_CHILDREN",
      "NOTIFICATION_PERMISSIONS",
      "POST_MESSAGES",
      "PUSH_NOTIFICATION_SUBSCRIPTION_REFRESH_INTERVAL",
      "PROTECTION_CONCERNS_SUBREPORTS",
      "REPORTING_LOCATIONS_SUBREPORTS",
      "SERVICES_SUBREPORTS",
      "FOLLOWUPS_SUBREPORTS",
      "PROTECTION_OUTCOMES_SUBREPORTS",
      "PROCESS_QUALITY_SUCCESSFUL_REFERRALS_SUBREPORTS",
      "PROCESS_QUALITY_IMPLEMENTED_REFERRALS_SUBREPORTS",
      "CASE_CHARACTERISTICS_SUBREPORTS"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(configConstants).toHaveProperty(property);
        delete clone[property];
      });
    });

    // DEPRECATED constants
    [
      "CONSENT_GIVEN_FIELD",
      "CASES_ASSIGNS",
      "CASES_BY_AGENCY",
      "CASES_BY_AGE_AND_SEX",
      "CASES_BY_NATIONALITY",
      "CASES_BY_PROTECTION_CONCERN",
      "CASES_REFERRALS",
      "CASES_TRANSFERS",
      "USERS_ASSIGN_TO",
      "USERS_TRANSFER_TO",
      "USERS_REFER_TO"
    ].forEach(property => {
      it(`DEPRECATED '${property}'`, () => {
        expect(configConstants).not.toHaveProperty(property);
      });
    });

    describe("values", () => {
      it("should have correct constant value", () => {
        const constants = { ...configConstants };

        expect(constants.FETCH_TIMEOUT).toBe(90000);
        expect(constants.DATABASE_NAME).toBe("primero");
        expect(constants.IDLE_TIMEOUT).toBe(15 * 1000 * 60);
        expect(constants.IDLE_LOGOUT_TIMEOUT).toBe(5 * 1000 * 60);
        expect(constants.TOKEN_REFRESH_INTERVAL).toBe(30 * 1000 * 60);
        expect(constants.RECORD_TYPES).toEqual({
          cases: "case",
          tracing_requests: "tracing_request",
          incidents: "incident",
          all: "all",
          registry_records: "registry_record",
          families: "family"
        });
        expect(constants.AGE_MAX).toBe(999);
        expect(Array.isArray(constants.PERMITTED_URL)).toBe(true);
        expect(constants.MODULES).toEqual({
          CP: "primeromodule-cp",
          GBV: "primeromodule-gbv",
          MRM: "primeromodule-mrm"
        });
        expect(constants.CONSENT_GIVEN_FIELD_BY_MODULE).toEqual({
          "primeromodule-cp": ["consent_for_services", "disclosure_other_orgs"],
          "primeromodule-gbv": ["consent_for_services"]
        });
        expect(constants.MODULE_TYPE_FIELD).toBe("module_id");
        expect(constants.TRANSITION_TYPE).toEqual(["transfers_assignments", "referral"]);
        expect(constants.RECORD_OWNER).toBe("record_owner");
        expect(constants.TRANSFERS_ASSIGNMENTS).toBe("transfers_assignments");
        expect(constants.REFERRAL).toBe("referral");
        expect(constants.NAME_FIELD).toBe("name");
        expect(constants.DATE_FORMAT).toBe("dd-MMM-yyyy");
        expect(constants.DATE_TIME_FORMAT).toBe("dd-MMM-yyyy HH:mm");
        expect(constants.USER_NAME_FIELD).toBe("user_name");
        expect(typeof constants.MODES).toEqual("object");
        expect(typeof constants.STRING_SOURCES_TYPES).toEqual("object");
        expect(constants.ID_FIELD).toBe("id");
        expect(constants.UNIQUE_ID_FIELD).toBe("unique_id");
        expect(constants.DISPLAY_TEXT_FIELD).toBe("display_text");
        expect(constants.CODE_FIELD).toBe("code");
        expect(typeof constants.LOOKUPS).toEqual("object");
        expect(Object.keys(constants.LOOKUPS)).toEqual(
          expect.arrayContaining([
            "agency_office",
            "armed_force_group_or_other_party",
            "risk_level",
            "workflow",
            "service_type",
            "protection_concerns",
            "followup_type",
            "reporting_locations",
            "gbv_violence_type",
            "cp_violence_type",
            "gender",
            "gender_unknown",
            "legitimate_basis",
            "legitimate_basis_explanations",
            "verification_status",
            "violation_type"
          ])
        );
        expect(Array.isArray(constants.RECORD_INFORMATION)).toBe(true);
        expect(typeof constants.INCIDENT_FROM_CASE).toBe("string");
        expect(constants.INCIDENT_FROM_CASE).toBe("incident_from_case");
        expect(typeof constants.APPROVALS).toBe("string");
        expect(typeof constants.APPROVALS_TYPES).toEqual("object");
        expect(Object.keys(constants.APPROVALS_TYPES)).toEqual(
          expect.arrayContaining(["action_plan", "assessment", "case_plan", "closure", "gbv_closure"])
        );

        expect(Object.keys(constants.ALERTS_FOR)).toEqual(
          expect.arrayContaining([
            "approval",
            "field_change",
            "incident_details",
            "new_form",
            "services_section",
            "transfer_request",
            "duplicate_field",
            "transfer",
            "referral"
          ])
        );

        expect(Array.isArray(constants.ROWS_PER_PAGE_OPTIONS)).toBe(true);

        expect(Object.keys(constants.DEFAULT_METADATA)).toEqual(expect.arrayContaining(["page", "per"]));

        expect(Object.keys(constants.HTTP_STATUS)).toContain("invalidRecord");

        expect(Object.keys(constants.DEFAULT_DATE_VALUES)).toEqual(expect.arrayContaining(["TODAY", "NOW"]));
      });
    });
  });
});
