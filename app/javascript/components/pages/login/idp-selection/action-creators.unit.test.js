import { expect } from "chai";

import * as actionCreators from "./action-creators";

describe("<IdpSelection /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("attemptLogin");
    delete creators.attemptLogin;

    expect(creators).to.deep.equal({});
  });
});