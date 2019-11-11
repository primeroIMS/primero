import { expect } from "chai";
import sinon from "sinon";

import * as actionCreators from "./action-creators";

describe("<Chips /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("setUpChips");
    expect(creators).to.have.property("setChip");
    delete creators.setUpChips;
    delete creators.setChip;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setUpChips' action creator to return the correct object", () => {
    const options = { risk_level: [] };
    const dispatch = sinon.spy(actionCreators, "setUpChips");

    actionCreators.setUpChips({ risk_level: [] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/SET_FILTERS",
      payload: options
    });
  });

  describe("should check setChip to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setChip");

    it("when chip is not included", () => {
      const options = { id: "risk_level", data: "high" };

      actionCreators.setChip({
        id: "risk_level",
        data: "high"
      }, false, "Cases");

      expect(dispatch.getCall(0).returnValue).to.eql({
        type: "Cases/ADD_CHIP",
        payload: options
      });
    });

    it("when chip is included", () => {
      const options = { id: "risk_level", data: "high" };

      actionCreators.setChip({
        id: "risk_level",
        data: "high"
      }, true, "Cases");

      expect(dispatch.getCall(1).returnValue).to.eql({
        type: "Cases/DELETE_CHIP",
        payload: options
      });
    });
  });
});