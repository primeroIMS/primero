import "test/test.setup";
import { expect } from "chai";
import clone from "lodash/clone";
import * as constants from "./constants";

describe("Constants", () => {
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
    expect(cloneConstants).to.have.property("CONSENT_GIVEN_FIELD");
    delete cloneConstants.FETCH_TIMEOUT;
    delete cloneConstants.DATABASE_NAME;
    delete cloneConstants.DB;
    delete cloneConstants.IDLE_TIMEOUT;
    delete cloneConstants.IDLE_LOGOUT_TIMEOUT;
    delete cloneConstants.TOKEN_REFRESH_INTERVAL;
    delete cloneConstants.RECORD_TYPES;
    delete cloneConstants.AGE_MAX;
    delete cloneConstants.PERMITTED_URL;
    delete cloneConstants.CONSENT_GIVEN_FIELD;

    expect(cloneConstants).to.deep.equal({});
  });
});
