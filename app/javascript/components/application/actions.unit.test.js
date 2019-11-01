import clone from "lodash/clone";
import { expect } from "chai";

import * as applicationActions from "./actions";

describe("Application - Actions", () => {
  it("should have known actions", () => {
    const actions = clone(applicationActions.default);

    expect(actions).to.have.property("FETCH_SYSTEM_SETTINGS");
    expect(actions).to.have.property("FETCH_SYSTEM_SETTINGS_SUCCESS");
    expect(actions).to.have.property("SET_USER_IDLE");
    expect(actions).to.have.property("NETWORK_STATUS");

    delete actions.FETCH_SYSTEM_SETTINGS;
    delete actions.FETCH_SYSTEM_SETTINGS_SUCCESS;
    delete actions.SET_USER_IDLE;
    delete actions.NETWORK_STATUS;

    expect(actions).to.deep.equal({});
  });
});
