import * as actionCreators from "./action-creators";
import * as actions from "./actions";

describe("components/drawer/action-creators.js", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["setDrawer", "toggleDrawer"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should create an action to set the drawer", () => {
    const payload = { formName: "some-form", open: true };

    const expectedAction = {
      type: actions.SET_DRAWER,
      payload
    };

    expect(actionCreators.setDrawer(payload)).to.eql(expectedAction);
  });

  it("should create an action to toggle the drawer", () => {
    const expectedAction = {
      type: actions.TOGGLE_DRAWER,
      payload: true
    };

    expect(actionCreators.toggleDrawer(true)).to.eql(expectedAction);
  });
});
