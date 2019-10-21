import clone from "lodash/clone";
import "test/test.setup";
import { expect } from "chai";
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
    expect(constants).to.have.property("PERMISSIONS");
    expect(constants).to.not.have.property("CONSENT_GIVEN_FIELD");
    expect(constants).to.not.have.property("MODULES");
    expect(constants).to.have.property("CONSENT_GIVEN_FIELD_BY_MODULE");
    expect(constants).to.have.property("MODULE_TYPE_FIELD");

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
    delete constants.PERMISSIONS;
    delete constants.CONSENT_GIVEN_FIELD_BY_MODULE;
    delete constants.MODULE_TYPE_FIELD;

    expect(constants).to.deep.equal({});
  });

  it("should have correct constant value", () => {
    const constants = { ...configConstants };
    expect(constants.FETCH_TIMEOUT).equal(30000);
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
      incidents: "incident"
    });
    expect(constants.AGE_MAX).equal(999);
    expect(constants.PERMITTED_URL).to.deep.equal([
      "/dashboard",
      "/login",
      "/logout",
      "/not-authorized",
      "/support"
    ]);
    expect(constants.MODULES).to.not.deep.equal({
      CP: "primeromodule-cp",
      GBV: "primeromodule-gbv"
    });
    expect(constants.CONSENT_GIVEN_FIELD_BY_MODULE).to.deep.equal({
      "primeromodule-cp": "consent_for_services",
      "primeromodule-gbv": "disclosure_other_orgs"
    });
    expect(constants.MODULE_TYPE_FIELD).to.equal("module_id");
  });
});
