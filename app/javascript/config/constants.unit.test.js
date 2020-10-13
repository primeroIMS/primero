import * as configConstants from "./constants";

describe("Verifying config constant", () => {
  it("exports an object", () => {
    expect(configConstants).to.be.an("object");
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...configConstants };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
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
      "CODE_FIELD",
      "CONSENT_GIVEN_FIELD_BY_MODULE",
      "DATABASE_NAME",
      "DATE_FORMAT",
      "DATE_TIME_FORMAT",
      "DEFAULT_METADATA",
      "DISPLAY_TEXT_FIELD",
      "FETCH_TIMEOUT",
      "HTTP_STATUS",
      "IDLE_LOGOUT_TIMEOUT",
      "IDLE_TIMEOUT",
      "ID_FIELD",
      "INCIDENT_CASE_ID_FIELD",
      "INCIDENT_CASE_SHORT_ID_FIELD",
      "INCIDENT_FROM_CASE",
      "LOCALE_KEYS",
      "LOOKUPS",
      "MAX_IMAGE_SIZE",
      "METHODS",
      "MODES",
      "MODULES",
      "MODULE_TYPE_FIELD",
      "NAME_FIELD",
      "PERMITTED_URL",
      "RECORD_INFORMATION",
      "RECORD_OWNER",
      "RECORD_PATH",
      "RECORD_TYPES",
      "RECORD_TYPES",
      "REFERRAL",
      "REJECT",
      "REJECTED",
      "ROUTES",
      "ROWS_PER_PAGE_OPTIONS",
      "SAVE_METHODS",
      "SAVING",
      "STRING_SOURCES_TYPES",
      "TOKEN_REFRESH_INTERVAL",
      "TRANSFERS_ASSIGNMENTS",
      "TRANSITIONS_DATE_FORMAT",
      "TRANSITION_TYPE",
      "UNIQUE_ID_FIELD",
      "USER_NAME_FIELD"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(configConstants).to.have.property(property);
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
        expect(configConstants).to.not.have.property(property);
      });
    });

    describe("values", () => {
      it("should have correct constant value", () => {
        const constants = { ...configConstants };

        expect(constants.FETCH_TIMEOUT).equal(50000);
        expect(constants.DATABASE_NAME).equal("primero");
        expect(constants.IDLE_TIMEOUT).equal(15 * 1000 * 60);
        expect(constants.IDLE_LOGOUT_TIMEOUT).equal(5 * 1000 * 60);
        expect(constants.TOKEN_REFRESH_INTERVAL).equal(30 * 1000 * 60);
        expect(constants.RECORD_TYPES).to.deep.equal({
          cases: "case",
          tracing_requests: "tracing_request",
          incidents: "incident",
          all: "all"
        });
        expect(constants.AGE_MAX).equal(999);
        expect(constants.PERMITTED_URL).to.be.an("array");
        expect(constants.MODULES).to.deep.equal({
          CP: "primeromodule-cp",
          GBV: "primeromodule-gbv"
        });
        expect(constants.CONSENT_GIVEN_FIELD_BY_MODULE).to.deep.equal({
          "primeromodule-cp": ["consent_for_services", "disclosure_other_orgs"],
          "primeromodule-gbv": ["consent_for_services"]
        });
        expect(constants.MODULE_TYPE_FIELD).to.equal("module_id");
        expect(constants.TRANSITION_TYPE).to.deep.equal(["transfers_assignments", "referral"]);
        expect(constants.RECORD_OWNER).to.equal("record_owner");
        expect(constants.TRANSFERS_ASSIGNMENTS).to.equal("transfers_assignments");
        expect(constants.REFERRAL).to.equal("referral");
        expect(constants.NAME_FIELD).to.be.equal("name");
        expect(constants.DATE_FORMAT).to.equal("dd-MMM-yyyy");
        expect(constants.DATE_TIME_FORMAT).to.equal("dd-MMM-yyyy HH:mm");
        expect(constants.USER_NAME_FIELD).to.equal("user_name");
        expect(constants.MODES).to.be.an("object");
        expect(constants.STRING_SOURCES_TYPES).to.be.an("object");
        expect(constants.ID_FIELD).to.equal("id");
        expect(constants.UNIQUE_ID_FIELD).to.equal("unique_id");
        expect(constants.DISPLAY_TEXT_FIELD).to.equal("display_text");
        expect(constants.CODE_FIELD).to.equal("code");
        expect(constants.LOOKUPS).to.be.an("object");
        expect(constants.LOOKUPS).to.have.all.keys(
          "risk_level",
          "workflow",
          "service_type",
          "protection_concerns",
          "followup_type",
          "reporting_locations"
        );
        expect(constants.RECORD_INFORMATION).to.be.an("array");
        expect(constants.INCIDENT_FROM_CASE).to.be.an("string");
        expect(constants.INCIDENT_FROM_CASE).to.equal("incident_from_case");
        expect(constants.APPROVALS).to.be.an("string");
        expect(constants.APPROVALS_TYPES).to.be.an("object");
        expect(constants.APPROVALS_TYPES).to.have.all.keys(
          "action_plan",
          "assessment",
          "case_plan",
          "closure",
          "gbv_closure"
        );

        expect(constants.ALERTS_FOR).to.have.all.keys(
          "approval",
          "field_change",
          "incident_details",
          "new_form",
          "services_section",
          "transfer_request"
        );

        expect(constants.ROWS_PER_PAGE_OPTIONS).to.be.an("array");

        expect(constants.DEFAULT_METADATA).to.have.all.keys("page", "per");

        expect(constants.HTTP_STATUS).to.have.all.keys("invalidRecord");
      });
    });
  });
});
