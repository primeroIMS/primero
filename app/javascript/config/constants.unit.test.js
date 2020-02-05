import { expect } from "../test";

import * as configConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...configConstants };

    expect(constants).to.have.property("FETCH_TIMEOUT");
    expect(constants).to.have.property("DATABASE_NAME");
    expect(constants).to.have.property("DB");
    expect(constants).to.have.property("IDLE_TIMEOUT");
    expect(constants).to.have.property("IDLE_LOGOUT_TIMEOUT");
    expect(constants).to.have.property("TOKEN_REFRESH_INTERVAL");
    expect(constants).to.have.property("RECORD_TYPES");
    expect(constants).to.have.property("AGE_MAX");
    expect(constants).to.have.property("PERMITTED_URL");
    expect(constants).to.have.property("RECORD_PATH");
    expect(constants).to.not.have.property("CONSENT_GIVEN_FIELD");
    expect(constants).to.have.property("MODULES");
    expect(constants).to.have.property("CONSENT_GIVEN_FIELD_BY_MODULE");
    expect(constants).to.have.property("MODULE_TYPE_FIELD");
    expect(constants).to.have.property("TRANSITION_TYPE");
    expect(constants).to.have.property("RECORD_OWNER");
    expect(constants).to.have.property("TRANSFERS_ASSIGNMENTS");
    expect(constants, "DEPRECATED CASES_BY_NATIONALITY").to.not.have.property(
      "CASES_BY_NATIONALITY"
    );
    expect(constants, "DEPRECATED CASES_BY_AGE_AND_SEX").to.not.have.property(
      "CASES_BY_AGE_AND_SEX"
    );
    expect(
      constants,
      "DEPRECATED CASES_BY_PROTECTION_CONCERN"
    ).to.not.have.property("CASES_BY_PROTECTION_CONCERN");
    expect(constants, "DEPRECATED CASES_BY_AGENCY").to.not.have.property(
      "CASES_BY_AGENCY"
    );
    expect(constants, "DEPRECATED USERS_ASSIGN_TO").to.not.have.property(
      "USERS_ASSIGN_TO"
    );
    expect(constants, "DEPRECATED USERS_TRANSFER_TO").to.not.have.property(
      "USERS_TRANSFER_TO"
    );
    expect(constants, "DEPRECATED USERS_REFER_TO").to.not.have.property(
      "USERS_REFER_TO"
    );
    expect(constants, "DEPRECATED CASES_ASSIGNS").to.not.have.property(
      "CASES_ASSIGNS"
    );
    expect(constants, "DEPRECATED CASES_TRANSFERS").to.not.have.property(
      "CASES_TRANSFERS"
    );
    expect(constants, "DEPRECATED CASES_REFERRALS").to.not.have.property(
      "CASES_REFERRALS"
    );
    expect(constants).to.have.property("ROUTES");
    expect(constants).to.have.property("REFERRAL");
    expect(constants).to.have.property("NAME_FIELD");
    expect(constants).to.have.property("DATE_FORMAT");
    expect(constants).to.have.property("DATE_TIME_FORMAT");
    expect(constants).to.have.property("USER_NAME_FIELD");
    expect(constants).to.have.property("MODES");
    expect(constants).to.have.property("TRANSITIONS_DATE_FORMAT");
    expect(constants).to.have.property("STRING_SOURCES_TYPES");
    expect(constants).to.have.property("ID_FIELD");
    expect(constants).to.have.property("UNIQUE_ID_FIELD");
    expect(constants).to.have.property("DISPLAY_TEXT_FIELD");
    expect(constants).to.have.property("CODE_FIELD");
    expect(constants).to.have.property("LOOKUPS");
    expect(constants).to.have.property("RECORD_INFORMATION");
    expect(constants).to.have.property("ADMIN_NAV");
    expect(constants).to.have.property("APPROVALS");
    expect(constants).to.have.property("RECORD_TYPES");

    delete constants.FETCH_TIMEOUT;
    delete constants.DATABASE_NAME;
    delete constants.DB;
    delete constants.IDLE_TIMEOUT;
    delete constants.IDLE_LOGOUT_TIMEOUT;
    delete constants.TOKEN_REFRESH_INTERVAL;
    delete constants.RECORD_TYPES;
    delete constants.AGE_MAX;
    delete constants.PERMITTED_URL;
    delete constants.RECORD_PATH;
    delete constants.CONSENT_GIVEN_FIELD_BY_MODULE;
    delete constants.MODULE_TYPE_FIELD;
    delete constants.MODULES;
    delete constants.TRANSITION_TYPE;
    delete constants.RECORD_OWNER;
    delete constants.TRANSFERS_ASSIGNMENTS;
    delete constants.CASES_BY_NATIONALITY;
    delete constants.CASES_BY_AGE_AND_SEX;
    delete constants.CASES_BY_PROTECTION_CONCERN;
    delete constants.CASES_BY_AGENCY;
    delete constants.USERS_ASSIGN_TO;
    delete constants.USERS_TRANSFER_TO;
    delete constants.USERS_REFER_TO;
    delete constants.CASES_ASSIGNS;
    delete constants.CASES_TRANSFERS;
    delete constants.CASES_REFERRALS;
    delete constants.ROUTES;
    delete constants.REFERRAL;
    delete constants.NAME_FIELD;
    delete constants.DATE_FORMAT;
    delete constants.DATE_TIME_FORMAT;
    delete constants.USER_NAME_FIELD;
    delete constants.MODES;
    delete constants.TRANSITIONS_DATE_FORMAT;
    delete constants.STRING_SOURCES_TYPES;
    delete constants.ID_FIELD;
    delete constants.UNIQUE_ID_FIELD;
    delete constants.DISPLAY_TEXT_FIELD;
    delete constants.CODE_FIELD;
    delete constants.LOOKUPS;
    delete constants.RECORD_INFORMATION;
    delete constants.ADMIN_NAV;
    delete constants.APPROVALS;
    delete constants.RECORD_TYPES;

    expect(constants).to.deep.equal({});
  });

  it("should have correct constant value", () => {
    const constants = { ...configConstants };

    expect(constants.FETCH_TIMEOUT).equal(50000);
    expect(constants.DATABASE_NAME).equal("primero");
    expect(constants.DB).to.deep.equal({
      USER: "user",
      FIELDS: "fields",
      FORMS: "forms",
      OPTIONS: "options",
      RECORDS: "records",
      SYSTEM_SETTINGS: "system_settings"
    });
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
    expect(constants.TRANSITION_TYPE).to.deep.equal([
      "transfers_assignments",
      "referral"
    ]);
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
      "protection_concerns"
    );
    expect(constants.RECORD_INFORMATION).to.be.an("array");
    expect(constants.APPROVALS).to.be.an("string");
  });
});
