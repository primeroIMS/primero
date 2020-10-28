import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("components/connectivity/action-creator.js", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["setNetworkStatus"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should create an action to set the network status", () => {
    const expectedAction = {
      type: actions.NETWORK_STATUS,
      payload: true
    };

    expect(actionCreators.setNetworkStatus(true)).to.eql(expectedAction);
  });
});
