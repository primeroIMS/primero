import { expect } from "chai";
import sinon from "sinon";

import * as actionCreators from "./action-creators";

describe("<SwitchButton /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("setSwitchButton");
    expect(creators).to.have.property("setSwitchValue");
    delete creators.setSwitchButton;
    delete creators.setSwitchValue;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setSwitchButton' action creator to return the correct object", () => {
    const options = { my_cases: [] };
    const dispatch = sinon.spy(actionCreators, "setSwitchButton");

    actionCreators.setSwitchButton({ my_cases: [] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/SET_FILTERS",
      payload: options
    });
  });

  describe("should check setSwitchValue to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setSwitchValue");
    it("when checkbox is not included", () => {
      const options = { id: "my_cases", included: false, data: "my_cases" };

      actionCreators.setSwitchValue(
        { id: "my_cases", included: false, data: "my_cases" },
        "Cases"
      );

      expect(dispatch.getCall(0).returnValue).to.eql({
        type: "Cases/ADD_SWITCH_BUTTON",
        payload: options
      });
    });

    it("when checkbox is included", () => {
      const options = { id: "my_cases", included: true, data: "my_cases" };

      actionCreators.setSwitchValue(
        { id: "my_cases", included: true, data: "my_cases" },
        "Cases"
      );

      expect(dispatch.getCall(1).returnValue).to.eql({
        type: "Cases/DELETE_SWITCH_BUTTON",
        payload: options
      });
    });
  });
});