import { expect } from "chai";

import * as actionCreators from "./action-creators";

describe("<Login /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("loginSystemSettings");
    delete creators.loginSystemSettings;

    expect(creators).to.deep.equal({});
  });
});
