import "test/test.setup";
import { expect } from "chai";
import clone from "lodash/clone";
import * as constants from "./constants";

describe("Verifying config constant", () => {
  it("should have known actions", () => {
    const cloneConstants = clone(constants);
    expect(cloneConstants).to.have.property("FETCH_TIMEOUT");
    expect(cloneConstants).to.have.property("DATABASE_NAME");
    expect(cloneConstants).to.have.property("DB");
    expect(cloneConstants).to.have.property("IDLE_TIMEOUT");
    expect(cloneConstants).to.have.property("IDLE_LOGOUT_TIMEOUT");
    expect(cloneConstants).to.have.property("TOKEN_REFRESH_INTERVAL");
    expect(cloneConstants).to.have.property("RECORD_TYPES");
    expect(cloneConstants).to.have.property("AGE_MAX");
    expect(cloneConstants).to.have.property("PERMITTED_URL");
    expect(cloneConstants).to.not.have.property("CONSENT_GIVEN_FIELD");
    expect(cloneConstants).to.not.have.property("MODULES");
    expect(cloneConstants).to.have.property("CONSENT_GIVEN_FIELD_BY_MODULE");
    expect(cloneConstants).to.have.property("MODULE_TYPE_FIELD");
    delete cloneConstants.FETCH_TIMEOUT;
    delete cloneConstants.DATABASE_NAME;
    delete cloneConstants.DB;
    delete cloneConstants.IDLE_TIMEOUT;
    delete cloneConstants.IDLE_LOGOUT_TIMEOUT;
    delete cloneConstants.TOKEN_REFRESH_INTERVAL;
    delete cloneConstants.RECORD_TYPES;
    delete cloneConstants.AGE_MAX;
    delete cloneConstants.PERMITTED_URL;
    delete cloneConstants.CONSENT_GIVEN_FIELD_BY_MODULE;
    delete cloneConstants.MODULE_TYPE_FIELD;

    expect(cloneConstants).to.deep.equal({});
  });

  it("should have correct constant value", () => {
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
      "/login",
      "/not-authorized",
      "/dashboard",
      "/logout"
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
