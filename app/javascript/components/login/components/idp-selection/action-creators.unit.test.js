import * as actionCreators from "./action-creators";

describe("<IdpSelection /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("attemptIDPLogin");
    delete creators.attemptIDPLogin;

    expect(creators).to.deep.equal({});
  });
});
