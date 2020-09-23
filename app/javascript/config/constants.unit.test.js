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
      "FETCH_TIMEOUT",
      "DATABASE_NAME",
      "IDLE_TIMEOUT",
      "IDLE_LOGOUT_TIMEOUT",
      "TOKEN_REFRESH_INTERVAL",
      "RECORD_TYPES",
      "AGE_MAX",
      "PERMITTED_URL",
      "RECORD_PATH",
      "CONSENT_GIVEN_FIELD_BY_MODULE",
      "MODULE_TYPE_FIELD",
      "MODULES",
      "TRANSITION_TYPE",
      "RECORD_OWNER",
      "TRANSFERS_ASSIGNMENTS",
      "ROUTES",
      "REFERRAL",
      "NAME_FIELD",
      "DATE_FORMAT",
      "DATE_TIME_FORMAT",
      "USER_NAME_FIELD",
      "MODES",
      "TRANSITIONS_DATE_FORMAT",
      "STRING_SOURCES_TYPES",
      "ID_FIELD",
      "UNIQUE_ID_FIELD",
      "DISPLAY_TEXT_FIELD",
      "CODE_FIELD",
      "LOOKUPS",
      "RECORD_INFORMATION",
      "ADMIN_NAV",
      "APPROVALS",
      "RECORD_TYPES",
      "ACCEPTED",
      "ACCEPT",
      "REJECTED",
      "REJECT",
      "METHODS",
      "SAVE_METHODS",
      "SAVING",
      "APPLICATION_NAV",
      "APPROVALS_TYPES",
      "ALERTS_FOR",
      "ROWS_PER_PAGE_OPTIONS",
      "MAX_IMAGE_SIZE",
      "DEFAULT_METADATA",
      "LOCALE_KEYS",
      "API_DATE_FORMAT",
      "API_DATE_TIME_FORMAT"
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
          "primeromodule-cp": "consent_for_services",
          "primeromodule-gbv": "disclosure_other_orgs"
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
          "followup_type"
        );
        expect(constants.RECORD_INFORMATION).to.be.an("array");
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
      });
    });
  });
});
